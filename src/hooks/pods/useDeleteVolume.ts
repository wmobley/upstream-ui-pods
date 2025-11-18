import { useMutation, useQueryClient } from '@tanstack/react-query';
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
        let url = `${basePath}/v3/pods/volumes/${encodeURIComponent(volumeId)}`;
        try {
          const parsed = new URL(url);
          if (!parsed.hostname.startsWith('pods.')) {
            parsed.hostname = `pods.${parsed.hostname}`;
            url = parsed.toString();
          }
        } catch {
          // ignore parse issues and use original url
        }
        const res = await fetch(url, {
          method: 'DELETE',
          headers: buildPodsHeaders(token),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to delete volume (${res.status})`);
        }
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
