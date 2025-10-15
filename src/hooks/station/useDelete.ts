import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StationsApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDelete = (campaignId: string) => {
  const config = useConfiguration();
  const stationsApi = new StationsApi(config);
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await stationsApi.deleteSensorApiV1CampaignsCampaignIdStationsDelete({
        campaignId: parseInt(campaignId),
      });
    },
    onSuccess: () => {
      // Invalidate campaign data to refresh stations list
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};