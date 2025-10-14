/**
 * Tapis authentication utilities for extracting and managing Tapis headers
 * These headers are set by Tapis Pods service after user authentication
 */

export interface TapisHeaders {
  'X-Tapis-Username'?: string;
  'X-Tapis-Tenant'?: string;
  'X-Tapis-Site'?: string;
  'Internal'?: string;
}

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

  if (!username || !tenant || !site) {
    return null;
  }

  return {
    'X-Tapis-Username': username,
    'X-Tapis-Tenant': tenant,
    'X-Tapis-Site': site,
    ...(internal && { 'Internal': internal }),
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
  if (!headers || !headers['X-Tapis-Username'] || !headers['X-Tapis-Tenant'] || !headers['X-Tapis-Site']) {
    return null;
  }

  return {
    username: headers['X-Tapis-Username'],
    tenant: headers['X-Tapis-Tenant'],
    site: headers['X-Tapis-Site'],
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

  if (!username || !tenant || !site) {
    return null;
  }

  return {
    'X-Tapis-Username': username,
    'X-Tapis-Tenant': tenant,
    'X-Tapis-Site': site,
    ...(internal && { 'Internal': internal }),
  };
};

/**
 * Initialize Tapis authentication from URL if available
 * Should be called on app startup
 */
export const initializeTapisAuth = (): boolean => {
  const urlHeaders = extractTapisHeadersFromUrl();

  if (urlHeaders) {
    storeTapisHeaders(urlHeaders);

    // Clean up URL params after storing
    const url = new URL(window.location.href);
    url.searchParams.delete('tapis_username');
    url.searchParams.delete('tapis_tenant');
    url.searchParams.delete('tapis_site');
    url.searchParams.delete('tapis_internal');
    window.history.replaceState({}, '', url.toString());

    return true;
  }

  return isTapisAuthenticated();
};
