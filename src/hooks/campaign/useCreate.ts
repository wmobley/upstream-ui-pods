import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CampaignsApi, CampaignsIn, CampaignCreateResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useCreate = () => {
  const config = useConfiguration();
  const campaignsApi = new CampaignsApi(config);
  const queryClient = useQueryClient();

  return useMutation<CampaignCreateResponse, Error, CampaignsIn>({
    mutationFn: async (campaignData: CampaignsIn) => {
      const response = await campaignsApi.createCampaignApiV1CampaignsPost({
        campaignsIn: campaignData,
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate campaigns list to refresh the cache
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};