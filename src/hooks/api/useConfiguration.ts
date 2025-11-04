import { Configuration } from '@upstream/upstream-api';
import { getTapisHeaders, isTapisAuthenticated } from '../../utils/tapisAuth';

const useConfiguration = () => {
  const runtimeBasePath =
    window.__UPSTREAM_CONFIG__?.VITE_UPSTREAM_API_URL?.trim() || undefined;
  const envBasePath = import.meta.env.VITE_UPSTREAM_API_URL?.trim() || undefined;
  const defaultBasePath = 'http://127.0.0.1:8000';
  const basePath = runtimeBasePath ?? envBasePath ?? defaultBasePath;

  if (!basePath) {
    throw new Error('UPSTREAM_API_URL is not set');
  }

  // Check for Tapis authentication first
  const tapisHeaders = getTapisHeaders();

  if (isTapisAuthenticated() && tapisHeaders) {
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

    // When running inside a Tapis pod, prefer the Tapis headers and do
    // not attach the local Authorization bearer token which may belong
    // to a different auth system. If a JWT is still desired for non-Tapis
    // flows, the fallback below will handle it.

    return new Configuration({ basePath, headers });
  }

  // Fallback: some environments may populate the Tapis access token into
  // sessionStorage under the key 'Tapis-Access-Token' but not provide the
  // full tapis headers. If we find that token, expose it as X-TAPIS-TOKEN so
  // backend proxies that expect that header will receive it.
  try {
    const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('Tapis-Access-Token') : null;
    if (sessionToken) {
      const headers: Record<string, string> = {
        'X-TAPIS-TOKEN': sessionToken,
        'Accept': 'application/json',
      };
      return new Configuration({ basePath, headers });
    }
  } catch (e) {
    // sessionStorage may be unavailable in some environments; ignore.
  }

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
