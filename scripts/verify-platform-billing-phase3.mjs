import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(import.meta.dirname, '..');
const srcRoot = path.join(repoRoot, 'src');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function makeIcon(name) {
  return function Icon(props = {}) {
    return React.createElement('svg', { ...props, 'data-icon': name });
  };
}

const lucide = new Proxy({}, {
  get: (_target, prop) => makeIcon(String(prop)),
});

function makeElement(tag) {
  return function Element({ children, className, ...props } = {}) {
    return React.createElement(tag, { ...props, className }, children);
  };
}

function resolveSource(request, fromFile) {
  if (request.startsWith('@/')) {
    return withExtension(path.join(srcRoot, request.slice(2)));
  }
  if (request.startsWith('.')) {
    return withExtension(path.resolve(path.dirname(fromFile), request));
  }
  return null;
}

function withExtension(base) {
  for (const candidate of [base, `${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`Cannot resolve source module: ${base}`);
}

function createLoader({ shellEnabled, queryResult }) {
  const cache = new Map();
  const hookCalls = [];
  const navigations = [];

  function load(file) {
    const resolved = path.resolve(file);
    if (cache.has(resolved)) return cache.get(resolved).exports;

    const source = fs.readFileSync(resolved, 'utf8');
    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: resolved,
    }).outputText;

    const module = { exports: {} };
    cache.set(resolved, module);

    const localRequire = (request) => {
      if (request === 'react') return React;
      if (request === 'react/jsx-runtime') return require('react/jsx-runtime');
      if (request === 'react-dom/server') return require('react-dom/server');
      if (request === 'lucide-react') return lucide;
      if (request === 'react-router-dom') {
        return {
          Navigate: ({ to }) => React.createElement('div', { 'data-navigate-to': to }),
          NavLink: ({ children, to }) => React.createElement('a', { href: to }, typeof children === 'function' ? children({ isActive: false }) : children),
          Outlet: () => React.createElement('main', null),
          useNavigate: () => (to) => navigations.push(to),
        };
      }
      if (request === '@tanstack/react-query') {
        return {
          useQuery: (options) => {
            hookCalls.push(options.enabled);
            return queryResult;
          },
          useQueryClient: () => ({ clear() {} }),
        };
      }
      if (request === '@/config/flags') {
        return { PLATFORM_BILLING_FRONTEND_SHELL: shellEnabled };
      }
      if (request === '../hooks/usePlatformBillingSummary') {
        return {
          usePlatformBillingSummary: (enabled) => {
            hookCalls.push(enabled);
            return queryResult;
          },
        };
      }
      if (request === '@/components/ui/Card') return { Card: makeElement('section') };
      if (request === '@/components/ui/Button') return { Button: makeElement('button') };
      if (request === '@/components/ui/Badge') return { Badge: makeElement('span') };
      if (request === '@/components/ui/PageHeader') {
        return { PageHeader: ({ title }) => React.createElement('h1', null, title) };
      }
      if (request === '@/features/auth') {
        return { useAuthStore: (selector) => selector({ clearAuth() {}, user: { name: 'Owner', organizationName: 'Studio' } }) };
      }
      if (request === '@/features/gym') {
        return { useBranchStore: () => ({ selectedBranch: { name: 'Main' }, clearBranches() {} }) };
      }
      if (request === '@/lib/services/assetService') {
        return { assetService: { async getLogoStatus() { return {}; } } };
      }

      const sourceFile = resolveSource(request, resolved);
      if (sourceFile) return load(sourceFile);
      return require(request);
    };

    const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', transpiled);
    fn(module.exports, localRequire, module, resolved, path.dirname(resolved));
    return module.exports;
  }

  return { load, hookCalls, navigations };
}

function summary(mode, available = true, recoveryActions = ['VIEW_PLAN_BILLING', 'CONTACT_SUPPORT']) {
  return {
    schema_version: 1,
    organization_id: '00000000-0000-0000-0000-000000000001',
    access: {
      mode,
      safe_reason_code: 'RAW_INTERNAL_REASON_SHOULD_NOT_RENDER',
      effective_from: '2026-06-19T00:00:00Z',
      next_transition_at: null,
      recovery_actions: recoveryActions,
      projection_freshness: available ? 'fresh' : 'missing',
    },
    plan: { code: 'DOERS_STARTER', display_name: 'Doers Starter', status: 'active' },
    billing_period: {
      period_start: '2026-06-01T00:00:00Z',
      period_end: '2026-07-01T00:00:00Z',
      subscription_status: 'active',
      cancel_at_period_end: false,
    },
    entitlements: [],
    usage: [{ key: 'limits.branches.active', current: 2, limit: 3, over_limit: false, stale_after: '2026-06-19T00:10:00Z' }],
    decision_availability: { available, reason: available ? null : 'projection_missing' },
    server_time: '2026-06-19T00:00:00Z',
  };
}

function renderWith({ shellEnabled, queryResult }, modulePath, exportName, props = {}) {
  const loader = createLoader({ shellEnabled, queryResult });
  const component = loader.load(path.join(srcRoot, modulePath))[exportName];
  const html = renderToStaticMarkup(React.createElement(component, props));
  return { html, loader };
}

function assertNoRawOrUnsafeText(html) {
  for (const forbidden of [
    'RAW_INTERNAL_REASON_SHOULD_NOT_RENDER',
    'projection_missing',
    'unpaid',
    'cancelled',
    'checkout',
    'Razorpay',
    'Cashfree',
  ]) {
    assert(!html.toLowerCase().includes(forbidden.toLowerCase()), `Rendered unsafe text: ${forbidden}`);
  }
}

function verifyDisabledShell() {
  let result = renderWith(
    { shellEnabled: false, queryResult: { data: summary('read_only'), isError: false, isLoading: false } },
    'features/platformBilling/components/PlatformBillingStatusBanner.tsx',
    'PlatformBillingStatusBanner',
  );
  assert(result.html === '', 'disabled banner should render nothing');
  assert(result.loader.hookCalls.every((enabled) => enabled === false), 'disabled banner query must be disabled');

  result = renderWith(
    { shellEnabled: false, queryResult: { data: summary('read_only'), isError: false, isLoading: false } },
    'features/platformBilling/pages/PlanBillingPage.tsx',
    'PlanBillingPage',
  );
  assert(result.html === '', 'disabled PlanBillingPage should render nothing');
  assert(result.loader.hookCalls.every((enabled) => enabled === false), 'disabled PlanBillingPage query must be disabled');

  result = renderWith(
    { shellEnabled: false, queryResult: {} },
    'components/layout/Sidebar.tsx',
    'Sidebar',
    { isOpen: false, setIsOpen() {} },
  );
  assert(result.html.includes('Subscriptions'), 'disabled sidebar should keep Subscriptions label');
  assert(result.html.includes('Payments'), 'disabled sidebar should keep Payments label');
  assert(!result.html.includes('Member Payments &amp; Collections'), 'disabled sidebar should not use Phase 3 payments label');
}

function verifyEnabledStates() {
  for (const mode of ['limited_write', 'read_only', 'billing_only', 'blocked']) {
    const result = renderWith(
      { shellEnabled: true, queryResult: { data: summary(mode), isError: false, isLoading: false } },
      'features/platformBilling/components/PlatformBillingStatusBanner.tsx',
      'PlatformBillingStatusBanner',
    );
    assert(result.html.length > 0, `${mode} banner should render`);
    assert(result.loader.hookCalls.every((enabled) => enabled === true), `${mode} banner query must be enabled`);
    assertNoRawOrUnsafeText(result.html);
  }

  const full = renderWith(
    { shellEnabled: true, queryResult: { data: summary('full'), isError: false, isLoading: false } },
    'features/platformBilling/components/PlatformBillingStatusBanner.tsx',
    'PlatformBillingStatusBanner',
  );
  assert(full.html === '', 'full available banner should stay silent');

  const unavailable = renderWith(
    { shellEnabled: true, queryResult: { data: summary('read_only', false), isError: false, isLoading: false } },
    'features/platformBilling/pages/PlanBillingPage.tsx',
    'PlanBillingPage',
  );
  assert(unavailable.html.includes('Account status is temporarily unavailable'), 'unavailable state should be safe');
  assertNoRawOrUnsafeText(unavailable.html);

  for (const status of [403, 503, 'network']) {
    const result = renderWith(
      { shellEnabled: true, queryResult: { data: undefined, isError: true, isLoading: false, error: { status } } },
      'features/platformBilling/pages/PlanBillingPage.tsx',
      'PlanBillingPage',
    );
    assert(result.html.includes('Account status is temporarily unavailable'), `${status} should render safe unavailable copy`);
    assert(!result.html.includes('data-navigate-to'), `${status} should not redirect`);
    assertNoRawOrUnsafeText(result.html);
  }

  const recovery = renderWith(
    { shellEnabled: true, queryResult: {} },
    'features/platformBilling/components/PlatformBillingRecoveryPanel.tsx',
    'PlatformBillingRecoveryPanel',
    { actions: ['UPDATE_PAYMENT_METHOD', 'COMPLETE_PAYMENT_ACTION', 'UNKNOWN_ACTION'] },
  );
  assert(recovery.html.includes('Update payment method'), 'registered recovery guidance should render');
  assert(!recovery.html.includes('UNKNOWN_ACTION'), 'unknown recovery action should be suppressed');
  assert(!recovery.html.includes('<button'), 'recovery guidance must not be clickable without backend action');
}

function verifyRouterSource() {
  const router = fs.readFileSync(path.join(srcRoot, 'app/router/index.tsx'), 'utf8');
  assert(router.includes('PLATFORM_BILLING_FRONTEND_SHELL ? <PlatformBillingStatusBanner /> : <TrialLockBanner />'), 'router must preserve legacy TrialLockBanner when shell disabled');
  assert(router.includes("path: 'billing-recovery'"), 'router should define billing recovery route for enabled shell');
  assert(router.includes('...(PLATFORM_BILLING_FRONTEND_SHELL ? ['), 'billing recovery route must be shell-gated');

  const api = fs.readFileSync(path.join(srcRoot, 'features/platformBilling/api/platformBillingApi.ts'), 'utf8');
  assert(api.includes("'/api/v1/platform-billing/summary'"), 'summary API path should be fixed');
  assert(!api.includes('organization_id') && !api.includes('org_id'), 'frontend summary request must not pass tenant ids');

  const hook = fs.readFileSync(path.join(srcRoot, 'features/platformBilling/hooks/usePlatformBillingSummary.ts'), 'utf8');
  assert(hook.includes('enabled,'), 'summary query must be controlled by the shell flag');
}

verifyDisabledShell();
verifyEnabledStates();
verifyRouterSource();
console.log('platform billing frontend Phase 3 verification OK');
