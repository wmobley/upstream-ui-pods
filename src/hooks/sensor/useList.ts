import { useState, useEffect } from 'react';
import {
  ListSensorsResponsePagination,
  SensorsApi,
} from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UseDetailReturn {
  data: ListSensorsResponsePagination | null;
  isLoading: boolean;
  error: Error | null;
}

export const useList = (
  campaignId: string,
  stationId: string,
): UseDetailReturn => {
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
            {
              campaignId: parseInt(campaignId),
              stationId: parseInt(stationId),
            },
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
  }, []);

  return { data, isLoading, error };
};
