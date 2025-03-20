import { useState, useEffect } from 'react';
import { SensorsApi, Configuration } from '@upstream/upstream-api';

const basePath = 'http://localhost:8000';
const accessToken = 'Bearer ' + localStorage.getItem('access_token');
const config = new Configuration({ basePath, accessToken });
const sensorsApi = new SensorsApi(config);

interface UseListReturn {
  data: any[];
  isLoading: boolean;
  error: Error | null;
}

export const useList = (
  campaignId: string,
  stationId: string,
): UseListReturn => {
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
