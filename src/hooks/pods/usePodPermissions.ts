import { useQuery } from '@tanstack/react-query';
import { Pods } from '@tapis/tapis-typescript';
import usePodsConfig from './usePodsConfig';
import { buildPodsHeaders, normalizePodsApiError } from '../../utils/pods';

const usePodPermissions = (podId: string | null) => {
  const { basePath, token } = usePodsConfig();

  return useQuery<Pods.PodPermissionsResponse, Error>({
    queryKey: ['pods', 'permissions', podId, basePath, token],
    enabled: Boolean(basePath && token && podId),
    queryFn: async () => {
      if (!podId) {
        throw new Error('Pod id is required to fetch permissions.');
      }
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
      const api = new Pods.PermissionsApi(configuration);

      try {
        return await api.getPodPermissions({ podId });
      } catch (error) {
        throw await normalizePodsApiError(error, 'Unable to load pod permissions');
      }
    },
  });
};

export default usePodPermissions;
