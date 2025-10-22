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
    const headers = Object.entries(tapisHeaders).reduce<Record<string, string>>((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const jwtToken = localStorage.getItem('access_token');
    if (jwtToken) {
      const bearer = `Bearer ${jwtToken}`;
      headers.Authorization = bearer;

      return new Configuration({
        basePath,
        headers,
        accessToken: bearer,
      });
    }

    return new Configuration({ basePath, headers });
  }

  // Fall back to JWT token authentication
  const token = localStorage.getItem('access_token');
  if (token) {
    const bearer = `Bearer ${token}`;
    const headers: Record<string, string> = {
      Authorization: bearer,
    };

    return new Configuration({
      basePath,
      headers,
      accessToken: bearer,
    });
  }

  return new Configuration({ basePath });
};

export default useConfiguration;
