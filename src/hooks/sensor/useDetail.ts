import { useState, useEffect } from 'react';
import { GetSensorResponse, SensorsApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UseDetailReturn {
  data: GetSensorResponse | null;
  isLoading: boolean;
  error: Error | null;
}

export const useDetail = (
  campaignId: string,
  stationId: string,
  sensorId: string,
): UseDetailReturn => {
  const config = useConfiguration();
  const sensorsApi = new SensorsApi(config);
  const [data, setData] = useState<GetSensorResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response =
          await sensorsApi.getSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdGet(
            {
              campaignId: parseInt(campaignId),
              stationId: parseInt(stationId),
              sensorId: parseInt(sensorId),
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
