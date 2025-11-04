import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StationsApi, StationCreate, StationCreateResponse, Configuration } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useCreate = (campaignId: string) => {
  const config = useConfiguration();

  // If a Tapis access token is stored in sessionStorage (from login), forward
  // it explicitly as X-TAPIS-TOKEN for CKAN-related server calls. This lets
  // the backend perform CKAN dataset registration when the token is present.
  const tapisToken = typeof window !== 'undefined' ? sessionStorage.getItem('Tapis-Access-Token') : null;
  let apiConfig = config;
  if (tapisToken) {
    const headers: Record<string, string> = {
      ...(config.headers as Record<string, string> | undefined),
      'X-TAPIS-TOKEN': tapisToken,
    };
    apiConfig = new Configuration({ basePath: config.basePath, headers, accessToken: config.accessToken });
  }

  const stationsApi = new StationsApi(apiConfig);
  const queryClient = useQueryClient();

  return useMutation<StationCreateResponse, Error, StationCreate>({
    mutationFn: async (stationData: StationCreate) => {
      const response = await stationsApi.createStationApiV1CampaignsCampaignIdStationsPost({
        campaignId: parseInt(campaignId),
        stationCreate: stationData,
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate campaigns list to refresh the cache (includes stations)
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};