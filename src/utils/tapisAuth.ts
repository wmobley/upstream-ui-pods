/**
 * Tapis authentication utilities for extracting and managing Tapis headers
 * These headers are set by Tapis Pods service after user authentication
 */

export interface TapisHeaders {
  'X-Tapis-Username'?: string;
  'X-Tapis-Tenant'?: string;
  'X-Tapis-Site'?: string;
  'Internal'?: string;
  'X-Tapis-Token'?: string;
}

const TAPIS_ACCESS_TOKEN_KEY = 'Tapis-Access-Token';
const TAPIS_REFRESH_TOKEN_KEY = 'Tapis-Refresh-Token';
const TAPIS_EXPIRES_AT_KEY = 'Tapis-Expires-At';

export interface TapisUser {
  username: string;
  tenant: string;
  site: string;
  internal?: string;
}

/**
 * Extract Tapis authentication headers from the current request/window
 * In a pod environment, these would be injected by Tapis
 */
export const getTapisHeaders = (): TapisHeaders | null => {
  // In a real Tapis pod environment, these headers would be available
  // For now, we'll check if they exist in sessionStorage (set by pod proxy)
  const username = sessionStorage.getItem('X-Tapis-Username');
  const tenant = sessionStorage.getItem('X-Tapis-Tenant');
  const site = sessionStorage.getItem('X-Tapis-Site');
  const internal = sessionStorage.getItem('Internal');
  const accessToken = sessionStorage.getItem(TAPIS_ACCESS_TOKEN_KEY);

  if (!username || !tenant || !site) {
    if (accessToken) {
      return {
        ...(username && { 'X-Tapis-Username': username }),
        ...(tenant && { 'X-Tapis-Tenant': tenant }),
        ...(site && { 'X-Tapis-Site': site }),
        ...(internal && { 'Internal': internal }),
        'X-Tapis-Token': accessToken,
      } as TapisHeaders;
    }
    return null;
  }

  return {
    'X-Tapis-Username': username,
    'X-Tapis-Tenant': tenant,
    'X-Tapis-Site': site,
    ...(internal && { 'Internal': internal }),
    ...(accessToken && { 'X-Tapis-Token': accessToken }),
  };
};

/**
 * Store Tapis headers in sessionStorage
 * This would typically be called when the pod first loads with Tapis headers
 */
export const storeTapisHeaders = (headers: TapisHeaders): void => {
  if (headers['X-Tapis-Username']) {
    sessionStorage.setItem('X-Tapis-Username', headers['X-Tapis-Username']);
  }
  if (headers['X-Tapis-Tenant']) {
    sessionStorage.setItem('X-Tapis-Tenant', headers['X-Tapis-Tenant']);
  }
  if (headers['X-Tapis-Site']) {
    sessionStorage.setItem('X-Tapis-Site', headers['X-Tapis-Site']);
  }
  if (headers['Internal']) {
    sessionStorage.setItem('Internal', headers['Internal']);
  }
};

/**
 * Clear stored Tapis headers
 */
export const clearTapisHeaders = (): void => {
  sessionStorage.removeItem('X-Tapis-Username');
  sessionStorage.removeItem('X-Tapis-Tenant');
  sessionStorage.removeItem('X-Tapis-Site');
  sessionStorage.removeItem('Internal');
};

interface TapisTokenPayload {
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: number | null;
}

export const clearTapisTokens = (): void => {
  sessionStorage.removeItem(TAPIS_ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(TAPIS_REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(TAPIS_EXPIRES_AT_KEY);
};

export const storeTapisTokens = (tokens: TapisTokenPayload): void => {
  clearTapisTokens();

  if (tokens.accessToken) {
    // Store the raw access token in sessionStorage so downstream code can
    // forward it as X-TAPIS-TOKEN. Add a brief debug message to confirm
    // storage during development.
    try {
      sessionStorage.setItem(TAPIS_ACCESS_TOKEN_KEY, tokens.accessToken);
      // Mask the token when logging to avoid accidentally exposing full value
      const masked = `${tokens.accessToken.slice(0, 6)}...${tokens.accessToken.slice(-6)}`;
      console.debug('[TapisAuth] stored access token in sessionStorage (masked):', masked);
    } catch (e) {
      // sessionStorage may be unavailable in some contexts (SSR, private mode)
      console.warn('[TapisAuth] Unable to store tapis access token in sessionStorage', e);
    }
      try {
      const payload = decodeJwt(tokens.accessToken);
      if (payload) {
        // Support multiple possible claim names for username
        if (typeof payload['tapis/username'] === 'string') {
          sessionStorage.setItem('X-Tapis-Username', payload['tapis/username']);
        } else if (typeof payload['preferred_username'] === 'string') {
          sessionStorage.setItem('X-Tapis-Username', payload['preferred_username']);
        } else if (typeof payload['username'] === 'string') {
          // Some Tapis tokens include a plain 'username' claim
          sessionStorage.setItem('X-Tapis-Username', payload['username']);
        }

        // Tenant and site claims may be namespaced under 'tapis/*'
        if (typeof payload['tapis/tenant_id'] === 'string') {
          sessionStorage.setItem('X-Tapis-Tenant', payload['tapis/tenant_id']);
        }
        if (typeof payload['tapis/site'] === 'string') {
          sessionStorage.setItem('X-Tapis-Site', payload['tapis/site']);
        }
      }
    } catch (error) {
      console.warn('[TapisAuth] Unable to decode Tapis access token', error);
    }
  }
  if (tokens.refreshToken) {
    sessionStorage.setItem(TAPIS_REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
  if (typeof tokens.expiresAt === 'number') {
    sessionStorage.setItem(TAPIS_EXPIRES_AT_KEY, tokens.expiresAt.toString());
  }
};

const decodeJwt = (token: string): Record<string, unknown> | null => {
  try {
    const segments = token.split('.');
    if (segments.length < 2) {
      return null;
    }
    const payloadSeg = segments[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const payload = JSON.parse(atob(payloadSeg.padEnd(payloadSeg.length + (4 - (payloadSeg.length % 4)) % 4, '=')));
    return payload as Record<string, unknown>;
  } catch (error) {
    console.warn('[TapisAuth] Failed to decode JWT', error);
    return null;
  }
};

/**
 * Check if user is authenticated via Tapis
 */
export const isTapisAuthenticated = (): boolean => {
  const headers = getTapisHeaders();
  return headers !== null;
};

/**
 * Get Tapis user information
 */
export const getTapisUser = (): TapisUser | null => {
  const headers = getTapisHeaders();
  if (!headers || !headers['X-Tapis-Username'] || !headers['X-Tapis-Tenant']) {
    return null;
  }

  return {
    username: headers['X-Tapis-Username'],
    tenant: headers['X-Tapis-Tenant'],
    site: headers['X-Tapis-Site'] ?? '',
    internal: headers['Internal'],
  };
};

/**
 * Extract Tapis headers from URL query parameters
 * Tapis pods may pass these as query params on initial load
 */
export const extractTapisHeadersFromUrl = (): TapisHeaders | null => {
  const params = new URLSearchParams(window.location.search);

  const username = params.get('tapis_username');
  const tenant = params.get('tapis_tenant');
  const site = params.get('tapis_site');
  const internal = params.get('tapis_internal');
  // Tapis pod proxy may pass the access token as a URL param on initial redirect
  const token = params.get('tapis_token') || params.get('X-Tapis-Token');

  if (!username && !tenant && !site && !token) {
    return null;
  }

  return {
    ...(username && { 'X-Tapis-Username': username }),
    ...(tenant && { 'X-Tapis-Tenant': tenant }),
    ...(site && { 'X-Tapis-Site': site }),
    ...(internal && { 'Internal': internal }),
    ...(token && { 'X-Tapis-Token': token }),
  };
};

// ---------------------------------------------------------------------------
// OAuth2 authorization code flow
// ---------------------------------------------------------------------------

function getTapisOAuthBaseUrl(): string {
  return (
    window.__UPSTREAM_CONFIG__?.VITE_TAPIS_PODS_BASE_URL?.trim() ||
    import.meta.env.VITE_TAPIS_PODS_BASE_URL?.trim() ||
    'https://portals.tapis.io'
  );
}

function getOAuthClientId(): string {
  return (
    window.__UPSTREAM_CONFIG__?.VITE_TAPIS_OAUTH_CLIENT_ID?.trim() ||
    import.meta.env.VITE_TAPIS_OAUTH_CLIENT_ID?.trim() ||
    'upstream-develop'
  );
}

function getOAuthClientKey(): string | undefined {
  return (
    window.__UPSTREAM_CONFIG__?.VITE_TAPIS_OAUTH_CLIENT_KEY?.trim() ||
    import.meta.env.VITE_TAPIS_OAUTH_CLIENT_KEY?.trim() ||
    undefined
  );
}

/** Redirect to Tapis OAuth2 authorization endpoint. */
export const initiateOAuthLogin = (): void => {
  const base = getTapisOAuthBaseUrl();
  const redirectUri = `${window.location.origin}/callback`;
  const params = new URLSearchParams({
    client_id: getOAuthClientId(),
    redirect_uri: redirectUri,
    response_type: 'code',
  });
  window.location.href = `${base}/v3/oauth2/authorize?${params}`;
};

/** Exchange an authorization code for Tapis tokens and store them. */
export const exchangeOAuthCode = async (code: string): Promise<void> => {
  const base = getTapisOAuthBaseUrl();
  const redirectUri = `${window.location.origin}/callback`;

  const clientKey = getOAuthClientKey();
  const resp = await fetch(`${base}/v3/oauth2/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      redirect_uri: redirectUri,
      client_id: getOAuthClientId(),
      grant_type: 'authorization_code',
      ...(clientKey && { client_key: clientKey }),
    }),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`OAuth token exchange failed (${resp.status}): ${body}`);
  }

  const data = await resp.json();
  const result = data.result ?? data;
  const accessTokenObj = result.access_token ?? {};
  const refreshTokenObj = result.refresh_token ?? {};

  // Tapis's TokenResponse schema (confirmed against tapipy's OpenAPI spec) returns
  // expires_at as a UTC string, not a number, and refresh_token's own JWT string
  // lives under `.refresh_token`, not `.access_token`. Compute a numeric epoch
  // expiry from expires_in (seconds) instead of trying to parse expires_at.
  const expiresIn = typeof accessTokenObj === 'string' ? undefined : accessTokenObj.expires_in;

  storeTapisTokens({
    accessToken: typeof accessTokenObj === 'string' ? accessTokenObj : accessTokenObj.access_token,
    refreshToken: typeof refreshTokenObj === 'string' ? refreshTokenObj : refreshTokenObj.refresh_token,
    expiresAt: typeof expiresIn === 'number' ? Math.floor(Date.now() / 1000) + expiresIn : null,
  });
};

// ---------------------------------------------------------------------------

/**
 * Initialize Tapis authentication from URL if available
 * Should be called on app startup
 */
export const initializeTapisAuth = (): boolean => {
  const urlHeaders = extractTapisHeadersFromUrl();

  if (urlHeaders) {
    storeTapisHeaders(urlHeaders);
    // If the pod proxy included the access token in the URL, store it so
    // InstanceContext can use it for Tapis API calls (e.g. GET /v3/pods/stacks).
    if (urlHeaders['X-Tapis-Token']) {
      storeTapisTokens({ accessToken: urlHeaders['X-Tapis-Token'] });
    }

    // Clean up URL params after storing
    const url = new URL(window.location.href);
    url.searchParams.delete('tapis_username');
    url.searchParams.delete('tapis_tenant');
    url.searchParams.delete('tapis_site');
    url.searchParams.delete('tapis_internal');
    url.searchParams.delete('tapis_token');
    url.searchParams.delete('X-Tapis-Token');
    window.history.replaceState({}, '', url.toString());

    return true;
  }

  return isTapisAuthenticated();
};
