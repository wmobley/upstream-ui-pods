import { useQuery } from '@tanstack/react-query';
import { StationsApi, GetStationResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDetail = (campaignId: string, stationId: string) => {
  const config = useConfiguration();
  const stationsApi = new StationsApi(config);

  const {
    data: station,
    isLoading,
    error,
  } = useQuery<GetStationResponse>({
    queryKey: ['station', campaignId, stationId],
    queryFn: async () => {
      const response =
        await stationsApi.getStationApiV1CampaignsCampaignIdStationsStationIdGet(
          {
            campaignId: parseInt(campaignId),
            stationId: parseInt(stationId),
          },
        );
      return response;
    },
  });

  return {
    station,
    isLoading,
    error: error as Error | null,
  };
};
