import { describe, it, expect } from 'vitest';
import { resolveApiBaseUrl, ApiBaseUrlError } from './apiBaseUrl';

// ---------------------------------------------------------------------------
// Helper: assert ApiBaseUrlError with a specific code, and verify the error
// message does not contain the raw invalid input.
// ---------------------------------------------------------------------------
function expectErrorCode(
  fn: () => unknown,
  expectedCode: string,
  rawInput?: string | null
): void {
  try {
    fn();
    expect.unreachable('Expected ApiBaseUrlError to be thrown');
  } catch (err) {
    expect(err).toBeInstanceOf(ApiBaseUrlError);
    expect((err as ApiBaseUrlError).code).toBe(expectedCode);
    if (rawInput !== undefined && rawInput !== null && rawInput.trim() !== '') {
      expect((err as ApiBaseUrlError).message).not.toContain(rawInput);
    }
  }
}

describe('resolveApiBaseUrl', () => {
  // =========================================================================
  // Development — accepted values
  // =========================================================================
  describe('development', () => {
    it('accepts loopback HTTP URLs', () => {
      expect(resolveApiBaseUrl('http://localhost:8000', { isProduction: false })).toBe('http://localhost:8000');
      expect(resolveApiBaseUrl('http://127.0.0.1:8000', { isProduction: false })).toBe('http://127.0.0.1:8000');
    });

    it('accepts local network HTTP URLs', () => {
      expect(resolveApiBaseUrl('http://192.168.1.10:8000', { isProduction: false })).toBe('http://192.168.1.10:8000');
    });

    it('accepts HTTPS absolute URLs', () => {
      expect(resolveApiBaseUrl('https://api.example.test', { isProduction: false })).toBe('https://api.example.test');
    });

    it('accepts same-origin paths', () => {
      expect(resolveApiBaseUrl('/api', { isProduction: false })).toBe('/api');
    });
  });

  // =========================================================================
  // Production — accepted values
  // =========================================================================
  describe('production', () => {
    it('accepts same-origin paths', () => {
      expect(resolveApiBaseUrl('/api', { isProduction: true })).toBe('/api');
      expect(resolveApiBaseUrl('/api/', { isProduction: true })).toBe('/api');
      expect(resolveApiBaseUrl('/api/v1', { isProduction: true })).toBe('/api/v1');
    });

    it('accepts HTTPS absolute URLs', () => {
      expect(resolveApiBaseUrl('https://api.example.test', { isProduction: true })).toBe('https://api.example.test');
      expect(resolveApiBaseUrl('https://api.example.test/', { isProduction: true })).toBe('https://api.example.test');
      expect(resolveApiBaseUrl('https://api.example.test/base/', { isProduction: true })).toBe('https://api.example.test/base');
    });

    it('rejects HTTP absolute URLs (non-loopback)', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('http://api.example.test', { isProduction: true }),
        'DOERS_API_BASE_URL_INSECURE_PRODUCTION',
        'http://api.example.test'
      );
    });

    // --- Loopback detection preempts HTTP rejection ---
    it('rejects production http://localhost:8000 as LOOPBACK_FORBIDDEN', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('http://localhost:8000', { isProduction: true }),
        'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN',
        'http://localhost:8000'
      );
    });

    it('rejects production http://127.0.0.1:8000 as LOOPBACK_FORBIDDEN', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('http://127.0.0.1:8000', { isProduction: true }),
        'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN',
        'http://127.0.0.1:8000'
      );
    });

    it('rejects production http://127.1.2.3 as LOOPBACK_FORBIDDEN', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('http://127.1.2.3', { isProduction: true }),
        'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN',
        'http://127.1.2.3'
      );
    });

    it('rejects production http://[::1] as LOOPBACK_FORBIDDEN', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('http://[::1]', { isProduction: true }),
        'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN',
        'http://[::1]'
      );
    });

    it('rejects production https://localhost as LOOPBACK_FORBIDDEN', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('https://localhost', { isProduction: true }),
        'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN',
        'https://localhost'
      );
    });

    it('rejects production https://subdomain.localhost as LOOPBACK_FORBIDDEN', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('https://subdomain.localhost', { isProduction: true }),
        'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN',
        'https://subdomain.localhost'
      );
    });

    it('rejects production http://0.0.0.0 as LOOPBACK_FORBIDDEN', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('http://0.0.0.0', { isProduction: true }),
        'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN',
        'http://0.0.0.0'
      );
    });

    it('rejects production http://[::] as LOOPBACK_FORBIDDEN', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('http://[::]', { isProduction: true }),
        'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN',
        'http://[::]'
      );
    });
  });

  // =========================================================================
  // Rejected in all environments
  // =========================================================================
  describe('rejected values (all environments)', () => {
    it('rejects missing (undefined)', () => {
      expectErrorCode(
        () => resolveApiBaseUrl(undefined, { isProduction: false }),
        'DOERS_API_BASE_URL_MISSING'
      );
    });

    it('rejects missing (null)', () => {
      expectErrorCode(
        () => resolveApiBaseUrl(null, { isProduction: false }),
        'DOERS_API_BASE_URL_MISSING'
      );
    });

    it('rejects empty string', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('', { isProduction: false }),
        'DOERS_API_BASE_URL_MISSING'
      );
    });

    it('rejects whitespace-only', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('   ', { isProduction: false }),
        'DOERS_API_BASE_URL_MISSING'
      );
    });

    it('rejects relative path without leading slash', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('api/v1', { isProduction: false }),
        'DOERS_API_BASE_URL_INVALID'
      );
    });

    it('rejects protocol-relative //host', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('//api.example.test', { isProduction: false }),
        'DOERS_API_BASE_URL_PROTOCOL_RELATIVE'
      );
    });

    it('rejects protocol-relative ///host', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('///api.example.test', { isProduction: false }),
        'DOERS_API_BASE_URL_PROTOCOL_RELATIVE'
      );
    });

    it('rejects same-origin paths with backslashes', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('/api\\v1', { isProduction: false }),
        'DOERS_API_BASE_URL_INVALID'
      );
    });

    it('rejects unsupported protocols', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('ws://api.example.test', { isProduction: false }),
        'DOERS_API_BASE_URL_UNSUPPORTED_PROTOCOL'
      );
      expectErrorCode(
        () => resolveApiBaseUrl('ftp://api.example.test', { isProduction: false }),
        'DOERS_API_BASE_URL_UNSUPPORTED_PROTOCOL'
      );
    });

    it('rejects embedded credentials', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('https://user:pass@api.example.test', { isProduction: false }),
        'DOERS_API_BASE_URL_CREDENTIALS_FORBIDDEN',
        'https://user:pass@api.example.test'
      );
    });

    it('rejects absolute URL with raw C0 control character', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('https://api.example.test/\x00', { isProduction: false }),
        'DOERS_API_BASE_URL_INVALID',
        'https://api.example.test/\x00'
      );
    });

    it('rejects same-origin path with raw C0 control character', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('/\x00api', { isProduction: false }),
        'DOERS_API_BASE_URL_INVALID',
        '/\x00api'
      );
    });

    it('rejects DEL control character', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('/api\x7F', { isProduction: false }),
        'DOERS_API_BASE_URL_INVALID',
        '/api\x7F'
      );
    });

    // --- Query strings and fragments ---
    it('rejects same-origin path with query string', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('/api?tenant=x', { isProduction: false }),
        'DOERS_API_BASE_URL_INVALID'
      );
    });

    it('rejects same-origin path with fragment', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('/api#section', { isProduction: false }),
        'DOERS_API_BASE_URL_INVALID'
      );
    });

    it('rejects absolute URL with query string', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('https://api.example.test?token=x', { isProduction: false }),
        'DOERS_API_BASE_URL_INVALID'
      );
    });

    it('rejects absolute URL with fragment', () => {
      expectErrorCode(
        () => resolveApiBaseUrl('https://api.example.test/#section', { isProduction: false }),
        'DOERS_API_BASE_URL_INVALID'
      );
    });
  });
});
