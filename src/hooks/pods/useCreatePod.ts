import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pods } from '@tapis/tapis-typescript';
import usePodsConfig from './usePodsConfig';
import { buildPodsHeaders, normalizePodsApiError } from '../../utils/pods';

const useCreatePod = () => {
  const { basePath, token } = usePodsConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPod: Pods.NewPod) => {
      if (!basePath) throw new Error('Pods base URL is not configured.');
      if (!token) throw new Error('Missing Tapis access token.');

      const url = `${basePath}/v3/pods`;
      const headers = {
        'Content-Type': 'application/json',
        ...buildPodsHeaders(token),
      };

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(newPod),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to create pod (${res.status})`);
        }
        const data = await res.json();
        return data;
      } catch (error) {
        throw await normalizePodsApiError(error, 'Unable to create pod');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pods', 'list'] });
    },
  });
};

export default useCreatePod;
