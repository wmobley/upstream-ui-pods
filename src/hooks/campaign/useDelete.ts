import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CampaignsApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDelete = () => {
  const config = useConfiguration();
  const campaignsApi = new CampaignsApi(config);
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (campaignId: string) => {
      await campaignsApi.deleteSensorApiV1CampaignsCampaignIdDelete({
        campaignId: parseInt(campaignId),
      });
    },
    onSuccess: (_, campaignId) => {
      // Remove the specific campaign from cache
      queryClient.removeQueries({ queryKey: ['campaign', campaignId] });
      // Invalidate campaigns list to refresh
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};