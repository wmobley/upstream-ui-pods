import { Configuration } from '@upstream/upstream-api';
import { getTapisHeaders } from '../../utils/tapisAuth';

const useConfiguration = () => {
  const runtimeBasePath =
    window.__UPSTREAM_CONFIG__?.VITE_UPSTREAM_API_URL?.trim() || undefined;
  const envBasePath = import.meta.env.VITE_UPSTREAM_API_URL?.trim() || undefined;
  const defaultBasePath = 'http://127.0.0.1:8000';
  const basePath = runtimeBasePath ?? envBasePath ?? defaultBasePath;

  if (!basePath) {
    throw new Error('UPSTREAM_API_URL is not set');
  }

  // Check for Tapis authentication first. Only treat the environment as a
  // Tapis "pod" when the full Tapis headers (username, tenant, site)
  // are present. Previously we considered a lone Tapis access token as
  // enough, which caused the client to prefer `X-TAPIS-TOKEN` and omit
  // the application's `Authorization: Bearer` header. That could result
  // in 401s for endpoints that expect the app JWT. Keep the tokens
  // distinct: prefer full Tapis headers only when the full set exists.
  const tapisHeaders = getTapisHeaders();

  const hasFullTapisHeaders = Boolean(
    tapisHeaders &&
      tapisHeaders['X-Tapis-Username'] &&
      tapisHeaders['X-Tapis-Tenant'] &&
      tapisHeaders['X-Tapis-Site']
  );

  if (hasFullTapisHeaders && tapisHeaders) {
    // Prefer Tapis-provided headers. Normalize token header to the
    // server-expected `X-TAPIS-TOKEN` and set Accept header for JSON.
    const headers = Object.entries(tapisHeaders).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value) {
        // Normalize the token header name to the server-expected casing
        if (key.toLowerCase() === 'x-tapis-token') {
          acc['X-TAPIS-TOKEN'] = value;
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {});

    // Ensure the API receives JSON responses
    headers['Accept'] = 'application/json';

    // When running inside a Tapis pod with full headers, prefer the
    // Tapis headers and do not attach the local Authorization bearer token.
    return new Configuration({ basePath, headers });
  }

  // NOTE: do NOT treat a lone tapis token in sessionStorage as the default
  // auth for the main API client. The application access token (stored in
  // localStorage as 'access_token') must be used for most upstream API
  // requests. CKAN-specific calls that require the Tapis token will read
  // it directly from sessionStorage where needed.

  // Fall back to JWT token authentication
  const token = localStorage.getItem('access_token');
  if (token) {
    const bearer = `Bearer ${token}`;
    const headers: Record<string, string> = {
      Authorization: bearer,
    };
    // Request JSON responses by default
    headers['Accept'] = 'application/json';

    return new Configuration({
      basePath,
      headers,
      accessToken: bearer,
    });
  }

  return new Configuration({ basePath });
};

export default useConfiguration;
