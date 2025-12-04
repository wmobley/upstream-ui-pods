import { useQuery } from '@tanstack/react-query';
import { Pods } from '@tapis/tapis-typescript';
import usePodsConfig from './usePodsConfig';
import { buildPodsHeaders, normalizePodsApiError } from '../../utils/pods';

const useVolumesList = () => {
  const { basePath, token } = usePodsConfig();

  return useQuery<Pods.VolumesResponse, Error>({
    queryKey: ['pods', 'volumes', basePath, token],
    enabled: Boolean(basePath && token),
    queryFn: async () => {
      if (!basePath) {
        throw new Error('Pods base URL is not configured.');
      }
      if (!token) {
        throw new Error('Missing Tapis access token.');
      }

      const url = `${basePath}/v3/pods/volumes`;
      const headers = buildPodsHeaders(token);

      try {
        const res = await fetch(url, { headers });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to load volumes (${res.status})`);
        }
        const json = await res.json();
        console.debug('[Pods] volumes response', json);
        return json;
      } catch (error) {
        throw await normalizePodsApiError(error, 'Unable to load volumes');
      }
    },
  });
};

export default useVolumesList;
