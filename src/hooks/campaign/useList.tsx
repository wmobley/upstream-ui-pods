import { useQuery } from '@tanstack/react-query';
import {
  CampaignsApi,
  ListCampaignsApiV1CampaignsGetRequest,
  ListCampaignsResponseItem,
} from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UseListReturn {
  data: ListCampaignsResponseItem[];
  isLoading: boolean;
  error: Error | null;
}

interface UseListProps {
  filters: ListCampaignsApiV1CampaignsGetRequest;
}

export const useList = ({ filters }: UseListProps): UseListReturn => {
  const config = useConfiguration();
  const campaignsApi = new CampaignsApi(config);

  const { data, isLoading, error } = useQuery({
    queryKey: ['campaigns', filters],
    queryFn: async () => {
      const response =
        await campaignsApi.listCampaignsApiV1CampaignsGet(filters);
      console.log('Campaigns API response:', response);
      console.log('Campaigns items:', response.items);
      console.log('Total campaigns:', response.items?.length);
      return response.items;
    },
  });

  return {
    data: data ?? [],
    isLoading,
    error: error as Error | null,
  };
};
