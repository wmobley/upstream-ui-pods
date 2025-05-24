import { useQuery } from '@tanstack/react-query';
import { CampaignsApi, GetCampaignResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDetail = (campaignId: string) => {
  const config = useConfiguration();
  const campaignsApi = new CampaignsApi(config);

  const {
    data: campaign,
    isLoading,
    error,
  } = useQuery<GetCampaignResponse, Error>({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const response =
        await campaignsApi.getCampaignApiV1CampaignsCampaignIdGet({
          campaignId: parseInt(campaignId),
        });
      return response;
    },
  });

  return {
    campaign,
    isLoading,
    error,
  };
};
