export interface ResolveApiBaseUrlOptions {
  isProduction: boolean;
}

export class ApiBaseUrlError extends Error {
  public code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'ApiBaseUrlError';
    this.code = code;
  }
}

export function resolveApiBaseUrl(
  rawValue: string | undefined | null,
  options: ResolveApiBaseUrlOptions
): string {
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

    if (trimmed.length > 1 && trimmed.endsWith('/')) {
      return trimmed.replace(/\/+$/, '');
    }
    return trimmed;
  }

  let url: URL;
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

  if (options.isProduction) {
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

  let normalizedPath = url.pathname;
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.replace(/\/+$/, '');
  } else if (normalizedPath === '/') {
    normalizedPath = '';
  }

  return `${url.protocol}//${url.host}${normalizedPath}`;
}
