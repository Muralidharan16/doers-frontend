// @vitest-environment node
import { describe, it, expect, afterEach } from 'vitest';
import { resolveProductionApiBaseUrl, getEffectiveApiBaseUrl, runValidation, ApiBaseUrlError } from './validate-api-base-url.mjs';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// ---------------------------------------------------------------------------
// Helper: assert ApiBaseUrlError with a specific code
// ---------------------------------------------------------------------------
function expectError(fn, expectedCode) {
  try {
    fn();
    expect.unreachable('Expected ApiBaseUrlError to be thrown');
  } catch (err) {
    expect(err).toBeInstanceOf(ApiBaseUrlError);
    expect(err.code).toBe(expectedCode);
  }
}

// ---------------------------------------------------------------------------
// Helper: assert error message does NOT contain the raw invalid input
// ---------------------------------------------------------------------------
function expectErrorWithoutRawValue(fn, expectedCode, rawInput) {
  try {
    fn();
    expect.unreachable('Expected ApiBaseUrlError to be thrown');
  } catch (err) {
    expect(err).toBeInstanceOf(ApiBaseUrlError);
    expect(err.code).toBe(expectedCode);
    if (rawInput !== undefined && rawInput !== null && String(rawInput).trim() !== '') {
      expect(err.message).not.toContain(String(rawInput));
    }
  }
}

// ---------------------------------------------------------------------------
// resolveProductionApiBaseUrl — pure validation function tests
// ---------------------------------------------------------------------------
describe('resolveProductionApiBaseUrl', () => {
  it('accepts /api', () => {
    expect(() => resolveProductionApiBaseUrl('/api')).not.toThrow();
  });

  it('normalizes /api/ (trailing slash) without throwing', () => {
    expect(() => resolveProductionApiBaseUrl('/api/')).not.toThrow();
  });

  it('accepts /api/v1', () => {
    expect(() => resolveProductionApiBaseUrl('/api/v1')).not.toThrow();
  });

  it('accepts HTTPS absolute URL', () => {
    expect(() => resolveProductionApiBaseUrl('https://api.example.test')).not.toThrow();
  });

  it('accepts HTTPS absolute URL with path', () => {
    expect(() => resolveProductionApiBaseUrl('https://api.example.test/base')).not.toThrow();
  });

  // --- Missing / empty / whitespace ---
  it('rejects missing (undefined)', () => {
    expectError(() => resolveProductionApiBaseUrl(undefined), 'DOERS_API_BASE_URL_MISSING');
  });

  it('rejects missing (null)', () => {
    expectError(() => resolveProductionApiBaseUrl(null), 'DOERS_API_BASE_URL_MISSING');
  });

  it('rejects empty string', () => {
    expectError(() => resolveProductionApiBaseUrl(''), 'DOERS_API_BASE_URL_MISSING');
  });

  it('rejects whitespace-only', () => {
    expectError(() => resolveProductionApiBaseUrl('   '), 'DOERS_API_BASE_URL_MISSING');
  });

  // --- Relative path without leading / ---
  it('rejects relative path without leading slash', () => {
    expectError(() => resolveProductionApiBaseUrl('api/v1'), 'DOERS_API_BASE_URL_INVALID');
  });

  // --- Protocol-relative ---
  it('rejects protocol-relative //host', () => {
    expectError(() => resolveProductionApiBaseUrl('//api.example.test'), 'DOERS_API_BASE_URL_PROTOCOL_RELATIVE');
  });

  it('rejects protocol-relative ///host', () => {
    expectError(() => resolveProductionApiBaseUrl('///api.example.test'), 'DOERS_API_BASE_URL_PROTOCOL_RELATIVE');
  });

  // --- Backslashes ---
  it('rejects backslashes in same-origin paths', () => {
    expectError(() => resolveProductionApiBaseUrl('/api\\v1'), 'DOERS_API_BASE_URL_INVALID');
  });

  // --- Control characters ---
  it('rejects raw C0 control characters in absolute URL', () => {
    expectErrorWithoutRawValue(
      () => resolveProductionApiBaseUrl('https://api.example.test/\x00'),
      'DOERS_API_BASE_URL_INVALID',
      'https://api.example.test/\x00'
    );
  });

  it('rejects raw C0 control characters in same-origin path', () => {
    expectErrorWithoutRawValue(
      () => resolveProductionApiBaseUrl('/\x00api'),
      'DOERS_API_BASE_URL_INVALID',
      '/\x00api'
    );
  });

  it('rejects DEL control character', () => {
    expectErrorWithoutRawValue(
      () => resolveProductionApiBaseUrl('/api\x7F'),
      'DOERS_API_BASE_URL_INVALID',
      '/api\x7F'
    );
  });

  // --- Unsupported protocols ---
  it('rejects unsupported protocol (ws:)', () => {
    expectError(() => resolveProductionApiBaseUrl('ws://api.example.test'), 'DOERS_API_BASE_URL_UNSUPPORTED_PROTOCOL');
  });

  it('rejects unsupported protocol (ftp:)', () => {
    expectError(() => resolveProductionApiBaseUrl('ftp://api.example.test'), 'DOERS_API_BASE_URL_UNSUPPORTED_PROTOCOL');
  });

  // --- Credentials ---
  it('rejects embedded credentials', () => {
    expectErrorWithoutRawValue(
      () => resolveProductionApiBaseUrl('https://user:pass@api.example.test'),
      'DOERS_API_BASE_URL_CREDENTIALS_FORBIDDEN',
      'https://user:pass@api.example.test'
    );
  });

  // --- Query strings ---
  it('rejects same-origin path with query string', () => {
    expectError(() => resolveProductionApiBaseUrl('/api?tenant=x'), 'DOERS_API_BASE_URL_INVALID');
  });

  it('rejects absolute URL with query string', () => {
    expectError(() => resolveProductionApiBaseUrl('https://api.example.test?token=x'), 'DOERS_API_BASE_URL_INVALID');
  });

  // --- Fragments ---
  it('rejects same-origin path with fragment', () => {
    expectError(() => resolveProductionApiBaseUrl('/api#section'), 'DOERS_API_BASE_URL_INVALID');
  });

  it('rejects absolute URL with fragment', () => {
    expectError(() => resolveProductionApiBaseUrl('https://api.example.test/#section'), 'DOERS_API_BASE_URL_INVALID');
  });

  // --- Localhost / loopback (production) ---
  it('rejects localhost', () => {
    expectError(() => resolveProductionApiBaseUrl('http://localhost:8000'), 'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN');
  });

  it('rejects .localhost subdomain', () => {
    expectError(() => resolveProductionApiBaseUrl('https://subdomain.localhost'), 'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN');
  });

  it('rejects 127.0.0.1', () => {
    expectError(() => resolveProductionApiBaseUrl('http://127.0.0.1:8000'), 'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN');
  });

  it('rejects 127/8 range (127.1.2.3)', () => {
    expectError(() => resolveProductionApiBaseUrl('http://127.1.2.3'), 'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN');
  });

  it('rejects IPv6 loopback [::1]', () => {
    expectError(() => resolveProductionApiBaseUrl('http://[::1]'), 'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN');
  });

  it('rejects 0.0.0.0', () => {
    expectError(() => resolveProductionApiBaseUrl('http://0.0.0.0'), 'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN');
  });

  it('rejects IPv6 unspecified [::]', () => {
    expectError(() => resolveProductionApiBaseUrl('http://[::]'), 'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN');
  });

  // --- External production HTTP ---
  it('rejects external production HTTP', () => {
    expectError(() => resolveProductionApiBaseUrl('http://api.example.test'), 'DOERS_API_BASE_URL_INSECURE_PRODUCTION');
  });

  // --- Error messages must not contain invalid raw values ---
  it('does not include invalid raw value in error message for loopback', () => {
    expectErrorWithoutRawValue(
      () => resolveProductionApiBaseUrl('http://localhost:8000'),
      'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN',
      'http://localhost:8000'
    );
  });

  it('does not include invalid raw value in error message for insecure HTTP', () => {
    expectErrorWithoutRawValue(
      () => resolveProductionApiBaseUrl('http://api.example.test'),
      'DOERS_API_BASE_URL_INSECURE_PRODUCTION',
      'http://api.example.test'
    );
  });
});

// ---------------------------------------------------------------------------
// Environment loading and precedence tests
// ---------------------------------------------------------------------------
describe('getEffectiveApiBaseUrl — environment file loading', () => {
  let tempDir;
  const savedEnv = {};

  afterEach(() => {
    // Restore process.env
    if ('VITE_API_BASE_URL' in savedEnv) {
      process.env.VITE_API_BASE_URL = savedEnv.VITE_API_BASE_URL;
    } else {
      delete process.env.VITE_API_BASE_URL;
    }
    delete savedEnv.VITE_API_BASE_URL;

    // Clean temp directory
    if (tempDir) {
      try { rmSync(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }
      tempDir = undefined;
    }
  });

  function createTempDir() {
    tempDir = mkdtempSync(join(tmpdir(), 'doers-validator-test-'));
    return tempDir;
  }

  it('loads /api from temporary .env when no process override', () => {
    // Save and clear process env
    if (Object.prototype.hasOwnProperty.call(process.env, 'VITE_API_BASE_URL')) {
      savedEnv.VITE_API_BASE_URL = process.env.VITE_API_BASE_URL;
    }
    delete process.env.VITE_API_BASE_URL;

    const dir = createTempDir();
    writeFileSync(join(dir, '.env'), 'VITE_API_BASE_URL=/api\n');

    const result = getEffectiveApiBaseUrl(dir);
    expect(result).toBe('/api');
  });

  it('loads HTTPS URL from temporary .env.production when no process override', () => {
    if (Object.prototype.hasOwnProperty.call(process.env, 'VITE_API_BASE_URL')) {
      savedEnv.VITE_API_BASE_URL = process.env.VITE_API_BASE_URL;
    }
    delete process.env.VITE_API_BASE_URL;

    const dir = createTempDir();
    // .env.production should override .env per Vite precedence
    writeFileSync(join(dir, '.env'), 'VITE_API_BASE_URL=/api\n');
    writeFileSync(join(dir, '.env.production'), 'VITE_API_BASE_URL=https://api.example.test\n');

    const result = getEffectiveApiBaseUrl(dir);
    expect(result).toBe('https://api.example.test');
  });

  it('process override takes precedence over environment file', () => {
    if (Object.prototype.hasOwnProperty.call(process.env, 'VITE_API_BASE_URL')) {
      savedEnv.VITE_API_BASE_URL = process.env.VITE_API_BASE_URL;
    }

    const dir = createTempDir();
    writeFileSync(join(dir, '.env'), 'VITE_API_BASE_URL=/api\n');

    process.env.VITE_API_BASE_URL = 'https://override.example.test';

    const result = getEffectiveApiBaseUrl(dir);
    expect(result).toBe('https://override.example.test');
  });

  it('explicit empty process override is selected and rejected', () => {
    if (Object.prototype.hasOwnProperty.call(process.env, 'VITE_API_BASE_URL')) {
      savedEnv.VITE_API_BASE_URL = process.env.VITE_API_BASE_URL;
    }

    const dir = createTempDir();
    writeFileSync(join(dir, '.env'), 'VITE_API_BASE_URL=/api\n');

    // Set as own property with empty string value
    process.env.VITE_API_BASE_URL = '';

    const result = getEffectiveApiBaseUrl(dir);
    expect(result).toBe('');

    // Verify the empty value is rejected by the validator
    expectError(() => resolveProductionApiBaseUrl(result), 'DOERS_API_BASE_URL_MISSING');
  });
});

// ---------------------------------------------------------------------------
// runValidation integration tests
// ---------------------------------------------------------------------------
describe('runValidation', () => {
  let tempDir;
  const savedEnv = {};

  afterEach(() => {
    if ('VITE_API_BASE_URL' in savedEnv) {
      process.env.VITE_API_BASE_URL = savedEnv.VITE_API_BASE_URL;
    } else {
      delete process.env.VITE_API_BASE_URL;
    }
    delete savedEnv.VITE_API_BASE_URL;

    if (tempDir) {
      try { rmSync(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }
      tempDir = undefined;
    }
  });

  function createTempDir() {
    tempDir = mkdtempSync(join(tmpdir(), 'doers-validator-run-'));
    return tempDir;
  }

  it('returns success for valid /api from env file', () => {
    if (Object.prototype.hasOwnProperty.call(process.env, 'VITE_API_BASE_URL')) {
      savedEnv.VITE_API_BASE_URL = process.env.VITE_API_BASE_URL;
    }
    delete process.env.VITE_API_BASE_URL;

    const dir = createTempDir();
    writeFileSync(join(dir, '.env'), 'VITE_API_BASE_URL=/api\n');

    const result = runValidation(dir);
    expect(result.success).toBe(true);
  });

  it('returns failure with correct code for loopback', () => {
    if (Object.prototype.hasOwnProperty.call(process.env, 'VITE_API_BASE_URL')) {
      savedEnv.VITE_API_BASE_URL = process.env.VITE_API_BASE_URL;
    }

    process.env.VITE_API_BASE_URL = 'http://localhost:8000';

    const dir = createTempDir();
    const result = runValidation(dir);
    expect(result.success).toBe(false);
    expect(result.code).toBe('DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN');
  });
});
