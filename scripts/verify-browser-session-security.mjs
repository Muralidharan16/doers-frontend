import { readFile } from 'node:fs/promises';

const credentialFreeFiles = [
  'src/features/auth/types/index.ts',
  'src/features/auth/services/authApi.ts',
  'src/features/auth/hooks/useLogin.ts',
  'src/shared/services/api/client.ts',
  'src/shared/components/AuthGuard.tsx',
  'src/components/layout/Sidebar.tsx',
  'src/pages/auth/check-inbox/page.tsx',
];

const forbiddenCredentialFragments = [
  'access_token',
  'refresh_token',
  'Authorization',
  'validateTenantAccess',
];

for (const file of credentialFreeFiles) {
  const source = await readFile(file, 'utf8');
  for (const fragment of forbiddenCredentialFragments) {
    if (source.includes(fragment)) {
      throw new Error(`${file} contains forbidden browser credential fragment: ${fragment}`);
    }
  }
}

const storeSource = await readFile('src/features/auth/store/authStore.ts', 'utf8');
if (storeSource.includes("from 'zustand/middleware'")) {
  throw new Error('Auth state must not use persisted Zustand browser storage.');
}
if (!storeSource.includes("removeItem(LEGACY_AUTH_STORAGE_KEY)")) {
  throw new Error('Legacy auth-storage credentials must be purged on load.');
}

const typeSource = await readFile('src/features/auth/types/index.ts', 'utf8');
if (!typeSource.includes('org_id: string;') || !typeSource.includes('role: string;')) {
  throw new Error('Authenticated session metadata must include server-established org_id and role.');
}

const apiSource = await readFile('src/features/auth/services/authApi.ts', 'utf8');
if (!apiSource.includes("post('/auth/signup-status'")) {
  throw new Error('Signup status must use POST so its poll secret is not placed in the URL.');
}
if (!apiSource.includes("post('/auth/refresh')")) {
  throw new Error('Browser refresh must use the cookie-only refresh endpoint.');
}

const clientSource = await readFile('src/shared/services/api/client.ts', 'utf8');
if (!clientSource.includes('refreshPromise')) {
  throw new Error('Browser refresh must remain single-flight.');
}
if (!clientSource.includes('withCredentials: true')) {
  throw new Error('Browser API transport must include secure cookies.');
}
if (!clientSource.includes('useAuthStore.getState()')) {
  throw new Error('Legacy routing adapter must read only authenticated in-memory session state.');
}
if (!clientSource.includes('return { org_id: user.org_id, role: user.role };')) {
  throw new Error('Legacy routing adapter must return only server-established org_id and role.');
}
if (!clientSource.includes("return { org_id: '', role: 'unauthenticated' };")) {
  throw new Error('Missing session metadata must fail closed rather than default to owner.');
}
for (const forbidden of [
  "localStorage.getItem('auth-storage')",
  'window.atob(',
  '.split(\'.\')',
  "'Bearer '",
  'jwt.decode',
]) {
  if (clientSource.includes(forbidden)) {
    throw new Error(`Browser API client reintroduced token parsing/transport: ${forbidden}`);
  }
}

const appShellSource = await readFile('src/components/layout/AppShell.tsx', 'utf8');
if (appShellSource.includes('authApi.getMe') || appShellSource.includes('syncUser')) {
  throw new Error('AppShell must not duplicate the AuthGuard server-session bootstrap.');
}

const sidebarSource = await readFile('src/components/layout/Sidebar.tsx', 'utf8');
if (!sidebarSource.includes('await authApi.logout()')) {
  throw new Error('Sign out must revoke the server session before clearing local state.');
}

console.log('Browser session security contract verified.');
