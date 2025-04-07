import { Configuration } from '@upstream/upstream-api';

const useConfiguration = () => {
  const basePath = import.meta.env.VITE_UPSTREAM_API_URL;
  console.log('basePath', basePath);
  const accessToken = 'Bearer ' + localStorage.getItem('access_token');
  if (!basePath) {
    throw new Error('UPSTREAM_API_URL is not set');
  }
  if (!accessToken) {
    return new Configuration({ basePath });
  }
  return new Configuration({ basePath, accessToken });
};

export default useConfiguration;
