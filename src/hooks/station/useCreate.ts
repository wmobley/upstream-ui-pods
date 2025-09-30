import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StationsApi, StationCreate, StationCreateResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useCreate = (campaignId: string) => {
  const config = useConfiguration();
  const stationsApi = new StationsApi(config);
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