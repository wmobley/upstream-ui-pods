import { useState, useEffect } from 'react';
import {
  ListMeasurementsResponsePagination,
  MeasurementsApi,
} from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UseDetailReturn {
  data: ListMeasurementsResponsePagination | null;
  isLoading: boolean;
  error: Error | null;
}

export const useList = (
  campaignId: string,
  stationId: string,
  sensorId: string,
): UseDetailReturn => {
  const config = useConfiguration();
  const measurementsApi = new MeasurementsApi(config);
  const [data, setData] = useState<ListMeasurementsResponsePagination | null>(
    null,
  );
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response =
          await measurementsApi.getSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGet(
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
