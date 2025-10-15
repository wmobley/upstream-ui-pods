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
      // Invalidate all campaigns queries to refresh the cache
      // This will match both ['campaigns'] and ['campaigns', filters]
      queryClient.invalidateQueries({ queryKey: ['campaigns'], exact: false });
    },
  });
};