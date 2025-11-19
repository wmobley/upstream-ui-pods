import { useMutation, useQueryClient } from '@tanstack/react-query';
import usePodsConfig from './usePodsConfig';
import { buildPodsHeaders, normalizePodsApiError } from '../../utils/pods';

const useRestartPod = () => {
  const { basePath, token } = usePodsConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (podId: string) => {
      if (!basePath) throw new Error('Pods base URL is not configured.');
      if (!token) throw new Error('Missing Tapis access token.');

      const url = `${basePath}/v3/pods/${encodeURIComponent(podId)}/restart`;
      const headers = buildPodsHeaders(token);

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to restart pod (${res.status})`);
        }
        const data = await res.json();
        return data;
      } catch (error) {
        throw await normalizePodsApiError(error, 'Unable to restart pod');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pods', 'list'] });
    },
  });
};

export default useRestartPod;
