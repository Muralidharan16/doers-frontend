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
  'getAuthTokenPayload',
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

const sidebarSource = await readFile('src/components/layout/Sidebar.tsx', 'utf8');
if (!sidebarSource.includes('await authApi.logout()')) {
  throw new Error('Sign out must revoke the server session before clearing local state.');
}

console.log('Browser session security contract verified.');
