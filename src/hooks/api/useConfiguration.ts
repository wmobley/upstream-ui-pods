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
    const headers: Record<string, string> = { ...tapisHeaders } as Record<string, string>;
    const jwtToken = localStorage.getItem('access_token');
    const bearer = jwtToken ? `Bearer ${jwtToken}` : undefined;
    if (bearer) {
      headers['Authorization'] = bearer;
    }

    return new Configuration({
      basePath,
      headers,
      accessToken: bearer,
    });
  }

  // Fall back to JWT token authentication
  const token = localStorage.getItem('access_token');
  const accessToken = token ? `Bearer ${token}` : undefined;
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = accessToken;
  }

  return new Configuration({ basePath, accessToken, headers });
};

export default useConfiguration;
