import Cookies from 'js-cookie';
import { getTapisHeaders, clearTapisHeaders } from './tapisAuth';

const clean = (value?: string | null) => value?.trim() || null;

const normalizeUrl = (value?: string | null): string | null => {
  const cleaned = clean(value);
  if (!cleaned) return null;
  try {
    const parsed = new URL(cleaned);
    if (parsed.hostname.includes('..')) {
      return null;
    }
    return cleaned;
  } catch {
    return null;
  }
};

const getRuntimeConfigValue = (key: keyof NonNullable<Window['__UPSTREAM_CONFIG__']>): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return clean(window.__UPSTREAM_CONFIG__?.[key]);
};

const derivePodsUrlFromTapisBase = (tapisBaseUrl: string | null): string | null => {
  if (!tapisBaseUrl) {
    return null;
  }
  try {
    const url = new URL(tapisBaseUrl);
    // Insert a pods. prefix in front of the host (e.g., portals.tapis.io -> pods.portals.tapis.io)
    const hostWithPods = url.host.startsWith('pods.') ? url.host : `pods.${url.host}`;
    return `${url.protocol}//${hostWithPods}`;
  } catch (error) {
    console.warn('[Pods] Unable to derive pods URL from TAPIS_BASE_URL', error);
    return null;
  }
};

export const resolvePodsBaseUrl = (): string | null => {
  const runtimePodsBase = normalizeUrl(getRuntimeConfigValue('VITE_TAPIS_PODS_BASE_URL'));
  const envPodsBase = normalizeUrl(import.meta.env.VITE_TAPIS_PODS_BASE_URL);
  const runtimeTapisBase = normalizeUrl(getRuntimeConfigValue('VITE_TAPIS_BASE_URL'));
  const envTapisBase = normalizeUrl(import.meta.env.VITE_TAPIS_BASE_URL);

  const derivedFromTapisBase =
    derivePodsUrlFromTapisBase(runtimeTapisBase) || derivePodsUrlFromTapisBase(envTapisBase);

  // Default to the portals tenant endpoint if nothing else is set.
  return clean(
    runtimePodsBase ||
      envPodsBase ||
      derivedFromTapisBase ||
      'https://portals.tapis.io'
  )
    ?.replace(/\/+$/, '') || null;
};

export const resolveCurrentPodId = (): string | null => {
  const runtimePodId = getRuntimeConfigValue('VITE_TAPIS_POD_ID');
  const envPodId = clean(import.meta.env.VITE_TAPIS_POD_ID);

  if (runtimePodId) return runtimePodId;
  if (envPodId) return envPodId;

  try {
    if (typeof window !== 'undefined') {
      const fromSession = sessionStorage.getItem('Tapis-Pod-Id') || sessionStorage.getItem('POD_ID');
      if (fromSession) return clean(fromSession);

      const params = new URLSearchParams(window.location.search);
      const podParam = params.get('pod_id') || params.get('podId');
      if (podParam) return clean(podParam);
    }
  } catch (error) {
    console.warn('[Pods] Unable to read current pod id from session/query', error);
  }

  return null;
};

export const resolveTapisAccessToken = (): string | null => {
  // Allow a development override via env or runtime config
  const runtimeToken = getRuntimeConfigValue('VITE_TAPIS_ACCESS_TOKEN');
  const envToken = clean(import.meta.env.VITE_TAPIS_ACCESS_TOKEN);
  if (runtimeToken) return runtimeToken;
  if (envToken) return envToken;

  try {
    const tapisHeaders = getTapisHeaders();
    if (tapisHeaders?.['X-Tapis-Token']) {
      return tapisHeaders['X-Tapis-Token'] || null;
    }

    if (typeof window !== 'undefined') {
      const sessionToken = sessionStorage.getItem('Tapis-Access-Token');
      if (sessionToken) {
        return sessionToken;
      }
    }
  } catch (error) {
    console.warn('[Pods] Failed to read token from sessionStorage or headers', error);
  }

  try {
    const cookieValue = Cookies.get('tapis-token');
    if (cookieValue) {
      const parsed = JSON.parse(cookieValue);
      if (parsed?.access_token && typeof parsed.access_token === 'string') {
        return parsed.access_token;
      }
    }
  } catch (error) {
    console.warn('[Pods] Failed to read token from cookie', error);
  }

  return null;
};

export const decodeJwtExp = (token: string): number | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    if (typeof decoded.exp === 'number') {
      return decoded.exp;
    }
  } catch {
    // ignore parse errors
  }
  return null;
};

export const decodeJwtTenant = (token: string): string | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + (4 - (normalized.length % 4)) % 4, '=');
    const json = JSON.parse(atob(padded));
    return (
      (typeof json['tapis/tenant_id'] === 'string' && json['tapis/tenant_id']) ||
      (typeof json['tenant_id'] === 'string' && json['tenant_id']) ||
      null
    );
  } catch {
    return null;
  }
};

export const resolveTapisTenant = (token?: string | null): string | null => {
  try {
    const headers = getTapisHeaders();
    if (headers?.['X-Tapis-Tenant']) return headers['X-Tapis-Tenant'];
  } catch {
    // ignore
  }
  if (token) {
    return decodeJwtTenant(token);
  }
  return null;
};

export const buildPodsHeaders = (token: string) => ({
  'X-Tapis-Token': token,
  'Accept': 'application/json',
});

export const clearTapisAuth = () => {
  try {
    sessionStorage.removeItem('Tapis-Access-Token');
    sessionStorage.removeItem('Tapis-Pod-Id');
    sessionStorage.removeItem('POD_ID');
    sessionStorage.removeItem('X-Tapis-Tenant');
    sessionStorage.removeItem('X-Tapis-Username');
    sessionStorage.removeItem('X-Tapis-Site');
  } catch {
    // ignore
  }
  try {
    clearTapisHeaders();
  } catch {
    // ignore
  }
  try {
    Cookies.remove('tapis-token');
  } catch {
    // ignore
  }
};

export const normalizePodsApiError = async (error: unknown, fallbackMessage: string): Promise<Error> => {
  if (error instanceof Error) {
    return error;
  }

  // Responses thrown from the generated client bubble up as Response objects.
  if (error && typeof (error as Response).text === 'function') {
    const response = error as Response;
    try {
      const text = await response.text();
      if (text) {
        const message = text.trim();
        if (message.includes('Invalid Tapis token')) {
          const invalidError = new Error(message);
          (invalidError as Error & { tapisInvalidToken?: boolean }).tapisInvalidToken = true;
          return invalidError;
        }
        return new Error(message);
      }
    } catch {
      // ignore and fall through
    }
    return new Error(`${fallbackMessage} (HTTP ${response.status})`);
  }

  return new Error(fallbackMessage);
};
