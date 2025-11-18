import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pods } from '@tapis/tapis-typescript';
import usePodsConfig from './usePodsConfig';
import { buildPodsHeaders, normalizePodsApiError } from '../../utils/pods';

const useDeleteVolume = () => {
  const { basePath, token } = usePodsConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (volumeId: string) => {
      if (!basePath) throw new Error('Pods base URL is not configured.');
      if (!token) throw new Error('Missing Tapis access token.');

      try {
        const configuration = new Pods.Configuration({
          basePath,
          headers: buildPodsHeaders(token),
        });
        const api = new Pods.VolumesApi(configuration);
        await api.deleteVolume({ volumeId });
        return volumeId;
      } catch (error) {
        throw await normalizePodsApiError(error, 'Unable to delete volume');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pods', 'volumes'] });
    },
  });
};

export default useDeleteVolume;
