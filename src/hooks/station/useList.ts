import { useQuery } from '@tanstack/react-query';
import {
  ListStationsApiV1CampaignsCampaignIdStationsGetRequest,
  ListStationsResponsePagination,
  StationsApi,
} from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UseListProps {
  filters: ListStationsApiV1CampaignsCampaignIdStationsGetRequest;
}

export const useList = ({ filters }: UseListProps) => {
  const config = useConfiguration();
  const stationsApi = new StationsApi(config);

  return useQuery<ListStationsResponsePagination>({
    queryKey: ['stations', filters],
    queryFn: async () => {
      const response =
        await stationsApi.listStationsApiV1CampaignsCampaignIdStationsGet(
          filters,
        );
      return response;
    },
  });
};
