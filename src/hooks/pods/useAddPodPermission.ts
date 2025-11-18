import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pods } from '@tapis/tapis-typescript';
import usePodsConfig from './usePodsConfig';
import { buildPodsHeaders, normalizePodsApiError } from '../../utils/pods';

interface AddPodPermissionInput {
  podId: string;
  user: string;
  level: string;
}

const useAddPodPermission = () => {
  const { basePath, token } = usePodsConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ podId, user, level }: AddPodPermissionInput) => {
      if (!basePath) throw new Error('Pods base URL is not configured.');
      if (!token) throw new Error('Missing Tapis access token.');
      if (!podId) throw new Error('Pod id is required.');
      if (!user.trim()) throw new Error('User is required.');

      const configuration = new Pods.Configuration({
        basePath,
        headers: buildPodsHeaders(token),
      });
      const api = new Pods.PermissionsApi(configuration);

      try {
        return await api.setPodPermission({
          podId,
          setPermission: { user, level },
        });
      } catch (error) {
        throw await normalizePodsApiError(error, 'Unable to add permission');
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pods', 'permissions', variables.podId] });
    },
  });
};

export default useAddPodPermission;
