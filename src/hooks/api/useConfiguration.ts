import { Configuration } from '@upstream/upstream-api';
import { getTapisHeaders, isTapisAuthenticated } from '../../utils/tapisAuth';

const useConfiguration = () => {
  const runtimeBasePath =
    window.__UPSTREAM_CONFIG__?.VITE_UPSTREAM_API_URL?.trim() || undefined;
  const envBasePath = import.meta.env.VITE_UPSTREAM_API_URL?.trim() || undefined;
  const basePath = runtimeBasePath ?? envBasePath;

  if (!basePath) {
    throw new Error('UPSTREAM_API_URL is not set');
  }

  // Check for Tapis authentication first
  const tapisHeaders = getTapisHeaders();

  if (isTapisAuthenticated() && tapisHeaders) {
    // If Tapis headers are present, include them in the configuration
    return new Configuration({
      basePath,
      headers: tapisHeaders as Record<string, string>,
    });
  }

  // Fall back to JWT token authentication
  const token = localStorage.getItem('access_token');
  const accessToken = token ? `Bearer ${token}` : undefined;

  return new Configuration({ basePath, accessToken });
};

export default useConfiguration;
