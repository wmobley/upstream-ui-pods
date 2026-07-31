import { Configuration } from '@upstream/upstream-api';
import { useInstance } from '../../contexts/InstanceContext';
import { getTapisHeaders } from '../../utils/tapisAuth';

const useConfiguration = () => {
  const { selectedInstance, discoveryEnabled } = useInstance();

  // --- Mode 1: An instance is selected (from discovery or fixed config) ---
  // Always target its API directly once known, even if the Tapis token is
  // momentarily unavailable (e.g. mid-refresh). Previously a missing token
  // here fell through to the "no instance" branch below, which returns an
  // empty basePath — that silently sends requests to the same origin (the
  // UI's own nginx) instead of the real API, and nginx has no route for
  // them, so it serves back the SPA shell with a 200 instead of a real
  // error. Keeping basePath pinned to the instance surfaces a genuine 401
  // from the backend instead.
  if (selectedInstance) {
    const tapisToken = sessionStorage.getItem('Tapis-Access-Token');
    return new Configuration({
      basePath: selectedInstance.apiUrl,
      headers: tapisToken
        ? { Authorization: `Bearer ${tapisToken}`, Accept: 'application/json' }
        : { Accept: 'application/json' },
    });
  }

  // --- Discovery mode with no instance yet: return empty config so API hooks
  // stay disabled rather than firing against a wrong localhost fallback. ---
  if (discoveryEnabled) {
    return new Configuration({ basePath: '' });
  }

  // --- Mode 2: Legacy per-project UI — fixed API URL from env/runtime config ---
  const runtimeBasePath =
    window.__UPSTREAM_CONFIG__?.VITE_UPSTREAM_API_URL?.trim() || undefined;
  const envBasePath = import.meta.env.VITE_UPSTREAM_API_URL?.trim() || undefined;
  const rawBasePath = runtimeBasePath ?? envBasePath ?? 'http://127.0.0.1:8000';
  const basePath = rawBasePath.replace(/\/+$/, '');

  // Mode 2a: Inside a Tapis pod — full proxy headers injected
  const tapisHeaders = getTapisHeaders();
  const hasFullTapisHeaders = Boolean(
    tapisHeaders?.['X-Tapis-Username'] &&
      tapisHeaders?.['X-Tapis-Tenant']
  );

  if (hasFullTapisHeaders && tapisHeaders) {
    const headers = Object.entries(tapisHeaders).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value) {
          acc[key.toLowerCase() === 'x-tapis-token' ? 'X-TAPIS-TOKEN' : key] = value;
        }
        return acc;
      },
      {}
    );
    headers['Accept'] = 'application/json';
    // API uses standard OAuth2 bearer auth — include Tapis token as Bearer too.
    const tapisToken =
      tapisHeaders['X-Tapis-Token'] || sessionStorage.getItem('Tapis-Access-Token');
    if (tapisToken) {
      headers['Authorization'] = `Bearer ${tapisToken}`;
    }
    return new Configuration({ basePath, headers });
  }

  // Mode 2b: Upstream HS256 JWT (username/password login, legacy path)
  const token = localStorage.getItem('access_token');
  if (token) {
    return new Configuration({
      basePath,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      accessToken: `Bearer ${token}`,
    });
  }

  return new Configuration({ basePath });
};

export default useConfiguration;
