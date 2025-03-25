import { useState, useEffect } from 'react';
import { SensorsApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UseListReturn {
  data: any[];
  isLoading: boolean;
  error: Error | null;
}

export const useList = (
  campaignId: string,
  stationId: string,
): UseListReturn => {
  const config = useConfiguration();
  const sensorsApi = new SensorsApi(config);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response =
          await sensorsApi.getSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGet(
            {
              campaignId: parseInt(campaignId),
              stationId: parseInt(stationId),
            },
          );
        setData(response.items);
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
