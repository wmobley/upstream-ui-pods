import { useQuery } from '@tanstack/react-query';
import { Pods } from '@tapis/tapis-typescript';
import usePodsConfig from './usePodsConfig';
import { buildPodsHeaders, normalizePodsApiError } from '../../utils/pods';

const usePodsList = () => {
  const { basePath, token } = usePodsConfig();

  return useQuery<Pods.PodsResponse, Error>({
    queryKey: ['pods', 'list', basePath, token],
    enabled: Boolean(basePath && token),
    queryFn: async () => {
      if (!basePath) {
        throw new Error('Pods base URL is not configured.');
      }
      if (!token) {
        throw new Error('Missing Tapis access token.');
      }

      const configuration = new Pods.Configuration({
        basePath,
        headers: buildPodsHeaders(token),
      });
      const api = new Pods.PodsApi(configuration);

      try {
        return await api.getPods();
      } catch (error) {
        throw await normalizePodsApiError(error, 'Unable to load pods');
      }
    },
  });
};

export default usePodsList;
