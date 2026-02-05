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
        const response = await api.getPods();
        const rawResult = response?.result as unknown;
        const normalized =
          Array.isArray(rawResult)
            ? rawResult
            : Array.isArray((rawResult as { items?: unknown }).items)
              ? (rawResult as { items: unknown[] }).items
              : Array.isArray((rawResult as { pods?: unknown }).pods)
                ? (rawResult as { pods: unknown[] }).pods
                : Array.isArray((rawResult as { result?: unknown }).result)
                  ? (rawResult as { result: unknown[] }).result
                  : [];

        if (!normalized.length && rawResult) {
          console.debug('[Pods] Unexpected pods list shape', {
            resultKeys: typeof rawResult === 'object' && rawResult ? Object.keys(rawResult as object) : rawResult,
          });
        }

        return {
          ...response,
          result: normalized as Pods.PodResponseModel[],
        };
      } catch (error) {
        throw await normalizePodsApiError(error, 'Unable to load pods');
      }
    },
  });
};

export default usePodsList;
