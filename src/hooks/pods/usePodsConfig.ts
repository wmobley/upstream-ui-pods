import { resolvePodsBaseUrl, resolveCurrentPodId, resolveTapisAccessToken } from '../../utils/pods';

export interface PodsConfig {
  basePath: string | null;
  token: string | null;
  currentPodId: string | null;
}

const usePodsConfig = (): PodsConfig => {
  const basePath = resolvePodsBaseUrl();
  const token = resolveTapisAccessToken();
  const currentPodId = resolveCurrentPodId();

  return {
    basePath,
    token,
    currentPodId,
  };
};

export default usePodsConfig;
