import { loadEnv } from 'vite';
import { pathToFileURL } from 'node:url';

export class ApiBaseUrlError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ApiBaseUrlError';
    this.code = code;
  }
}

/**
 * Validates an API base URL value against the production security policy.
 * This is always evaluated as production — the build validator only runs
 * at build time for production configuration.
 *
 * @param {string | undefined | null} rawValue
 * @returns {void}
 * @throws {ApiBaseUrlError}
 */
export function resolveProductionApiBaseUrl(rawValue) {
  if (rawValue === undefined || rawValue === null) {
    throw new ApiBaseUrlError(
      'DOERS API configuration is invalid. Set VITE_API_BASE_URL to a same-origin path such as /api or to an HTTPS API URL.',
      'DOERS_API_BASE_URL_MISSING'
    );
  }

  const rawString = String(rawValue);

  const trimmed = rawString.trim();
  if (trimmed === '') {
    throw new ApiBaseUrlError(
      'DOERS API configuration is invalid. Set VITE_API_BASE_URL to a same-origin path such as /api or to an HTTPS API URL.',
      'DOERS_API_BASE_URL_MISSING'
    );
  }

  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1F\x7F]/.test(rawString)) {
    throw new ApiBaseUrlError(
      'DOERS API configuration cannot contain control characters.',
      'DOERS_API_BASE_URL_INVALID'
    );
  }

  if (trimmed.startsWith('//')) {
    throw new ApiBaseUrlError(
      'Protocol-relative URLs are not supported for VITE_API_BASE_URL. Use a same-origin path such as /api or an HTTPS API URL.',
      'DOERS_API_BASE_URL_PROTOCOL_RELATIVE'
    );
  }

  if (trimmed.startsWith('/')) {
    if (trimmed.includes('\\')) {
      throw new ApiBaseUrlError(
        'Same-origin paths cannot contain backslashes.',
        'DOERS_API_BASE_URL_INVALID'
      );
    }

    if (trimmed.includes('?') || trimmed.includes('#')) {
      throw new ApiBaseUrlError(
        'Query strings and fragments are not allowed in VITE_API_BASE_URL.',
        'DOERS_API_BASE_URL_INVALID'
      );
    }

    return; // valid same-origin path
  }

  let url;
  try {
    url = new URL(trimmed);
  } catch (e) {
    throw new ApiBaseUrlError(
      'DOERS API configuration is invalid. Set VITE_API_BASE_URL to a same-origin path such as /api or to an HTTPS API URL.',
      'DOERS_API_BASE_URL_INVALID'
    );
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new ApiBaseUrlError(
      'Unsupported protocol. Only http: and https: are allowed.',
      'DOERS_API_BASE_URL_UNSUPPORTED_PROTOCOL'
    );
  }

  if (url.username || url.password) {
    throw new ApiBaseUrlError(
      'Credentials in VITE_API_BASE_URL are forbidden.',
      'DOERS_API_BASE_URL_CREDENTIALS_FORBIDDEN'
    );
  }

  if (url.search || url.hash) {
    throw new ApiBaseUrlError(
      'Query strings and fragments are not allowed in VITE_API_BASE_URL.',
      'DOERS_API_BASE_URL_INVALID'
    );
  }

  const hostname = url.hostname.toLowerCase();
  const isLoopback =
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname === '127.0.0.1' ||
    /^127\.\d+\.\d+\.\d+$/.test(hostname) ||
    hostname === '::1' ||
    hostname === '[::1]' ||
    hostname === '0.0.0.0' ||
    hostname === '::' ||
    hostname === '[::]';

  // Loopback detection preempts generic HTTP rejection
  if (isLoopback) {
    throw new ApiBaseUrlError(
      'Loopback addresses are forbidden in production builds. Set VITE_API_BASE_URL to a same-origin path such as /api or to an HTTPS API URL.',
      'DOERS_API_BASE_URL_LOOPBACK_FORBIDDEN'
    );
  }

  if (url.protocol === 'http:') {
    throw new ApiBaseUrlError(
      'Insecure HTTP absolute URLs are forbidden in production.',
      'DOERS_API_BASE_URL_INSECURE_PRODUCTION'
    );
  }
}

/**
 * Resolves the effective VITE_API_BASE_URL using Vite's loadEnv and
 * process.env precedence. Process environment overrides file-based values.
 *
 * @param {string} cwd - The working directory for Vite env file resolution.
 * @returns {string | undefined} The effective value.
 */
export function getEffectiveApiBaseUrl(cwd) {
  const fileEnv = loadEnv('production', cwd, '');

  const effectiveValue =
    Object.prototype.hasOwnProperty.call(
      process.env,
      'VITE_API_BASE_URL',
    )
      ? process.env.VITE_API_BASE_URL
      : fileEnv.VITE_API_BASE_URL;

  return effectiveValue;
}

/**
 * Runs the full validation pipeline: resolves the effective value and
 * validates it against production security policy.
 *
 * @param {string} cwd - The working directory for Vite env file resolution.
 * @returns {{ success: boolean, code?: string, message?: string }}
 */
export function runValidation(cwd) {
  try {
    const effectiveValue = getEffectiveApiBaseUrl(cwd);
    resolveProductionApiBaseUrl(effectiveValue);
    return { success: true };
  } catch (err) {
    if (err instanceof ApiBaseUrlError) {
      return { success: false, code: err.code, message: err.message };
    }
    return {
      success: false,
      code: 'DOERS_API_BASE_URL_VALIDATION_ERROR',
      message: 'API configuration validation could not be completed.',
    };
  }
}

/**
 * CLI entry point. Runs the validation and exits with appropriate code.
 */
function runCli() {
  const result = runValidation(process.cwd());

  if (result.success) {
    process.exit(0);
  } else {
    console.error(`[${result.code}] ${result.message}`);
    process.exit(1);
  }
}

// Direct-execution guard: only run CLI when invoked as the main script.
const isDirectExecution =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  runCli();
}
