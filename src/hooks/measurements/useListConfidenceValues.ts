import { useState, useEffect } from 'react';
import {
  AggregatedMeasurement,
  GetMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGetRequest,
  MeasurementsApi,
} from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UseDetailReturn {
  data: AggregatedMeasurement[] | null;
  isLoading: boolean;
  error: Error | null;
}

export const useListConfidenceValues = (
  campaignId: string,
  stationId: string,
  sensorId: string,
  interval: string,
  intervalValue: number,
): UseDetailReturn => {
  const config = useConfiguration();
  const measurementsApi = new MeasurementsApi(config);
  const [data, setData] = useState<AggregatedMeasurement[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setLoading(true);
        const requestParams: GetMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGetRequest =
          {
            campaignId: parseInt(campaignId),
            stationId: parseInt(stationId),
            sensorId: parseInt(sensorId),
            interval: interval,
            intervalValue: intervalValue,
            minValue: 0,
          };
        const response =
          await measurementsApi.getMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGet(
            requestParams,
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
  }, [campaignId, stationId, sensorId, interval, intervalValue]);

  return { data, isLoading, error };
};
