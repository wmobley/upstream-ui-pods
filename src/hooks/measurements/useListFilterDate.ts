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

export const useListFilterDate = (
  campaignId: string,
  stationId: string,
  sensorId: string,
  limit: number = 500000,
  downsampleThreshold: number | undefined = undefined,
  startDate: Date,
  endDate: Date,
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
        setLoading(true);
        const response =
          await measurementsApi.getSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGet(
            {
              campaignId: parseInt(campaignId),
              stationId: parseInt(stationId),
              sensorId: parseInt(sensorId),
              downsampleThreshold: downsampleThreshold,
              minMeasurementValue: 0,
              limit: limit,
              startDate: startDate,
              endDate: endDate,
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
  }, [
    campaignId,
    stationId,
    sensorId,
    limit,
    downsampleThreshold,
    startDate,
    endDate,
  ]);

  return { data, isLoading, error };
};
