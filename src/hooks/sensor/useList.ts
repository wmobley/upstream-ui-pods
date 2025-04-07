import { useState, useEffect } from 'react';
import {
  ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest,
  ListSensorsResponsePagination,
  SensorsApi,
} from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UseDetailReturn {
  data: ListSensorsResponsePagination | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseListProps {
  filters: ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest;
}

export const useList = ({ filters }: UseListProps): UseDetailReturn => {
  const config = useConfiguration();
  const sensorsApi = new SensorsApi(config);
  const [data, setData] = useState<ListSensorsResponsePagination | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response =
          await sensorsApi.listSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGet(
            filters,
          );
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Unknown error occurred'),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSensors();
  }, [filters]);

  return { data, isLoading, error };
};
