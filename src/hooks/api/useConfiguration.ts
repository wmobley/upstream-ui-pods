import { Configuration } from '@upstream/upstream-api';

const useConfiguration = () => {
  const basePath = import.meta.env.VITE_UPSTREAM_API_URL;
  const token = localStorage.getItem('access_token');
  const accessToken = token ? `Bearer ${token}` : undefined;

  if (!basePath) {
    throw new Error('UPSTREAM_API_URL is not set');
  }

  return new Configuration({ basePath, accessToken });
};

export default useConfiguration;
