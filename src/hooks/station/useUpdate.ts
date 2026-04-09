import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Configuration,
  StationCreateResponse,
  StationsApi,
  StationUpdate,
} from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

type UpdateStationParams = {
  campaignId: string;
  stationId: string;
  stationUpdate: StationUpdate;
};

export const useUpdate = () => {
  const config = useConfiguration();
  const tapisToken =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('Tapis-Access-Token')
      : null;

  let apiConfig = config;
  if (tapisToken) {
    const headers: Record<string, string> = {
      ...(config.headers as Record<string, string> | undefined),
      'X-TAPIS-TOKEN': tapisToken,
    };
    apiConfig = new Configuration({
      basePath: config.basePath,
      headers,
      accessToken: config.accessToken,
    });
  }

  const stationsApi = new StationsApi(apiConfig);
  const queryClient = useQueryClient();

  return useMutation<StationCreateResponse, Error, UpdateStationParams>({
    mutationFn: async ({ campaignId, stationId, stationUpdate }) =>
      stationsApi.partialUpdateStationApiV1CampaignsCampaignIdStationsStationIdPatch(
        {
          campaignId: parseInt(campaignId),
          stationId: parseInt(stationId),
          stationUpdate,
        },
      ),
    onSuccess: (_, { campaignId, stationId }) => {
      queryClient.invalidateQueries({
        queryKey: ['station', campaignId, stationId],
      });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'], exact: false });
    },
  });
};
