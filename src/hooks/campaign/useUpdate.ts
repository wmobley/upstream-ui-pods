import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CampaignCreateResponse,
  CampaignUpdate,
  CampaignsApi,
} from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

type UpdateCampaignParams = {
  campaignId: string;
  campaignUpdate: CampaignUpdate;
};

export const useUpdate = () => {
  const config = useConfiguration();
  const campaignsApi = new CampaignsApi(config);
  const queryClient = useQueryClient();

  return useMutation<CampaignCreateResponse, Error, UpdateCampaignParams>({
    mutationFn: async ({ campaignId, campaignUpdate }) =>
      campaignsApi.partialUpdateCampaignApiV1CampaignsCampaignIdPatch({
        campaignId: parseInt(campaignId),
        campaignUpdate,
      }),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'], exact: false });
    },
  });
};
