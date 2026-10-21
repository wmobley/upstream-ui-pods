import { useQuery } from '@tanstack/react-query';
import {
  ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest,
  ListSensorsResponsePagination,
  SensorsApi,
} from '@upstream/upstream-api';
import useConfiguration, { useApiReadiness } from '../api/useConfiguration';

interface UseListProps {
  filters: ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest;
}

export const useList = ({ filters }: UseListProps) => {
  const config = useConfiguration();
  const { apiReady } = useApiReadiness();
  const sensorsApi = new SensorsApi(config);

  return useQuery<ListSensorsResponsePagination>({
    queryKey: ['sensors', filters],
    enabled: apiReady,
    queryFn: async () => {
      const response =
        await sensorsApi.listSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGet(
          filters,
        );
      return response;
    },
  });
};
