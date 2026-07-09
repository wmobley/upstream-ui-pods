import { Configuration } from '@upstream/upstream-api';
import { useInstance } from '../../contexts/InstanceContext';
import { getTapisHeaders } from '../../utils/tapisAuth';

const useConfiguration = () => {
  const { selectedInstance, discoveryEnabled } = useInstance();

  // --- Mode 1: Unified UI — instance selected, use Tapis JWT as Bearer ---
  if (discoveryEnabled && selectedInstance) {
    const tapisToken = sessionStorage.getItem('Tapis-Access-Token');
    if (tapisToken) {
      return new Configuration({
        basePath: selectedInstance.apiUrl,
        headers: {
          Authorization: `Bearer ${tapisToken}`,
          Accept: 'application/json',
        },
      });
    }
  }

  // --- Mode 2: Legacy per-project UI — fixed API URL from env/runtime config ---
  const runtimeBasePath =
    window.__UPSTREAM_CONFIG__?.VITE_UPSTREAM_API_URL?.trim() || undefined;
  const envBasePath = import.meta.env.VITE_UPSTREAM_API_URL?.trim() || undefined;
  const defaultBasePath = 'http://127.0.0.1:8000';
  const rawBasePath = runtimeBasePath ?? envBasePath ?? defaultBasePath;
  const basePath = rawBasePath.replace(/\/+$/, '');

  // Mode 2a: Inside a Tapis pod — full proxy headers injected
  const tapisHeaders = getTapisHeaders();
  const hasFullTapisHeaders = Boolean(
    tapisHeaders?.['X-Tapis-Username'] &&
      tapisHeaders?.['X-Tapis-Tenant'] &&
      tapisHeaders?.['X-Tapis-Site']
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
