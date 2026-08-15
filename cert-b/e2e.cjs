'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

const ORIGIN = process.env.CERT_B_ORIGIN || 'https://cert-b.local:8443';
const MAILBOX = process.env.CERT_B_MAILBOX || '/tmp/doers-cert-b/mailbox.jsonl';
const PASSWORD = 'CertB-Owner-2026!';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForVerification(email) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const lines = fs.existsSync(MAILBOX)
      ? fs.readFileSync(MAILBOX, 'utf8').trim().split('\n').filter(Boolean)
      : [];
    for (const line of lines.reverse()) {
      const message = JSON.parse(line);
      if (!message.to.includes(email)) continue;
      const match = message.body.match(/https:\/\/cert-b\.local:8443\/api\/auth\/verify\?token=[A-Za-z0-9_-]+/);
      if (match) return match[0];
    }
    await sleep(250);
  }
  throw new Error(`verification email not captured for ${email}`);
}

async function assertNoBrowserSecrets(page) {
  const storage = await page.evaluate(() => ({
    local: Object.entries(localStorage),
    session: Object.entries(sessionStorage),
  }));
  const serialized = JSON.stringify(storage).toLowerCase();
  for (const forbidden of ['access_token', 'refresh_token', 'signup_poll_token', 'bearer ']) {
    assert.equal(serialized.includes(forbidden), false, `browser storage leaked ${forbidden}`);
  }
}

async function signupAndVerify(browser, suffix) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  const email = `cert-b-${suffix}-${Date.now()}@example.invalid`;

  const first = await page.goto(`${ORIGIN}/signup`, { waitUntil: 'networkidle' });
  assert.equal(first.status(), 200);
  assert.equal(first.headers()['strict-transport-security']?.includes('max-age='), true);
  assert.equal(first.headers()['x-content-type-options'], 'nosniff');
  assert.equal(first.headers()['x-frame-options'], 'DENY');
  assert.ok(first.headers()['content-security-policy']?.includes("frame-ancestors 'none'"));

  await page.locator('input[name="org_name"]').fill(`CERT-B ${suffix}`);
  await page.locator('select[name="facility_type"]').selectOption('gym');
  await page.getByRole('button', { name: 'Next Step' }).click();
  await page.locator('input[name="owner_name"]').fill(`CERT-B Owner ${suffix}`);
  await page.locator('input[name="email"]').fill(email);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('input[name="confirm_password"]').fill(PASSWORD);
  await page.getByRole('button', { name: 'Finish Setup' }).click();
  await page.waitForURL('**/check-inbox');
  await assertNoBrowserSecrets(page);

  let cookies = await context.cookies();
  const pollCookie = cookies.find((cookie) => cookie.name === 'signup_poll_token');
  assert.ok(pollCookie, 'signup poll capability must be a cookie');
  assert.equal(pollCookie.httpOnly, true);
  assert.equal(pollCookie.secure, true);
  assert.equal(pollCookie.sameSite, 'Lax');
  assert.equal(pollCookie.path, '/auth');

  const verifyUrl = await waitForVerification(email);
  const verifyPage = await context.newPage();
  await verifyPage.goto(verifyUrl, { waitUntil: 'networkidle' });
  await verifyPage.waitForURL('**/auth/verify-success');
  await verifyPage.close();

  await page.waitForURL('**/onboarding', { timeout: 15000 });
  await assertNoBrowserSecrets(page);

  cookies = await context.cookies();
  const access = cookies.find((cookie) => cookie.name === 'access_token');
  const refresh = cookies.find((cookie) => cookie.name === 'refresh_token');
  assert.ok(access && refresh, 'verified signup must establish browser session cookies');
  for (const cookie of [access, refresh]) {
    assert.equal(cookie.httpOnly, true);
    assert.equal(cookie.secure, true);
    assert.equal(cookie.sameSite, 'Lax');
  }
  assert.equal(access.path, '/');
  assert.equal(refresh.path, '/auth');
  assert.equal(cookies.some((cookie) => cookie.name === 'signup_poll_token'), false);

  const session = await page.evaluate(async () => {
    const response = await fetch('/api/auth/me', { credentials: 'include' });
    return { status: response.status, body: await response.json(), cache: response.headers.get('cache-control') };
  });
  assert.equal(session.status, 200);
  assert.equal(session.cache?.includes('no-store'), true);
  assert.ok(session.body.user.org_id);
  assert.equal(session.body.user.role, 'owner');
  assert.equal(JSON.stringify(session.body).includes('access_token'), false);
  assert.equal(JSON.stringify(session.body).includes('refresh_token'), false);

  const missingOrigin = await context.request.post(`${ORIGIN}/api/auth/refresh`, { headers: { Cookie: `refresh_token=${refresh.value}` } });
  assert.equal(missingOrigin.status(), 403, 'unsafe cookie mutation without Origin must fail closed');
  const hostileOrigin = await context.request.post(`${ORIGIN}/api/auth/refresh`, {
    headers: { Cookie: `refresh_token=${refresh.value}`, Origin: 'https://evil.example.invalid' },
  });
  assert.equal(hostileOrigin.status(), 403, 'hostile Origin must fail closed');

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForURL('**/onboarding');
  await assertNoBrowserSecrets(page);

  return { context, page, email, orgId: session.body.user.org_id, oldRefresh: refresh.value };
}

async function login(page, email) {
  await page.goto(`${ORIGIN}/login`);
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL((url) => !url.pathname.endsWith('/login'), { timeout: 10000 });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const tenantA = await signupAndVerify(browser, 'tenant-a');
    const tenantB = await signupAndVerify(browser, 'tenant-b');

    const crossTenant = await tenantA.page.evaluate(async (orgId) => {
      const response = await fetch(`/api/organizations/${orgId}/members`, { credentials: 'include' });
      return response.status;
    }, tenantB.orgId);
    assert.ok([401, 403, 404].includes(crossTenant), `cross-tenant request unexpectedly returned ${crossTenant}`);

    const refreshed = [];
    tenantA.page.on('response', (response) => {
      if (response.url().includes('/api/auth/refresh')) refreshed.push(response.status());
    });
    await sleep(65000);
    await tenantA.page.goto(`${ORIGIN}/members`, { waitUntil: 'networkidle' });
    assert.equal(refreshed.length, 1, `expected one browser refresh after access expiry, saw ${refreshed.length}`);

    const replay = await tenantA.context.request.post(`${ORIGIN}/api/auth/refresh`, {
      headers: { Cookie: `refresh_token=${tenantA.oldRefresh}`, Origin: ORIGIN },
    });
    assert.equal(replay.status(), 401, 'rotated refresh replay must be rejected');
    const afterReplay = await tenantA.context.request.get(`${ORIGIN}/api/auth/me`);
    assert.equal(afterReplay.status(), 401, 'refresh replay must revoke the durable session family');

    await login(tenantA.page, tenantA.email);
    const logout = await tenantA.page.evaluate(async () => {
      const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      return response.status;
    });
    assert.equal(logout, 200);
    const cookiesAfterLogout = await tenantA.context.cookies();
    assert.equal(cookiesAfterLogout.some((cookie) => ['access_token', 'refresh_token'].includes(cookie.name)), false);
    assert.equal((await tenantA.context.request.get(`${ORIGIN}/api/auth/me`)).status(), 401);

    await tenantA.context.close();
    await tenantB.context.close();
    console.log('CERT-B browser/deployment certification passed');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
