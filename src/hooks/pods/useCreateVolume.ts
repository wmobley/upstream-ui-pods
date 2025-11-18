import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pods } from '@tapis/tapis-typescript';
import usePodsConfig from './usePodsConfig';
import { buildPodsHeaders, normalizePodsApiError } from '../../utils/pods';

const useCreateVolume = () => {
  const { basePath, token } = usePodsConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newVolume: Pods.NewVolume) => {
      if (!basePath) throw new Error('Pods base URL is not configured.');
      if (!token) throw new Error('Missing Tapis access token.');

      const configuration = new Pods.Configuration({
        basePath,
        headers: buildPodsHeaders(token),
      });
      const api = new Pods.VolumesApi(configuration);

      try {
        return await api.createVolume({ newVolume });
      } catch (error) {
        throw await normalizePodsApiError(error, 'Unable to create volume');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pods', 'volumes'] });
    },
  });
};

export default useCreateVolume;
