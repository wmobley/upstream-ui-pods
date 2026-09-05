import { keepPreviousData, useQuery } from '@tanstack/react-query';
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
  minValue?: number,
  maxValue?: number,
  startDate?: Date,
  endDate?: Date,
): UseDetailReturn => {
  const config = useConfiguration();
  const measurementsApi = new MeasurementsApi(config);

  const startDateKey = startDate?.toISOString() ?? null;
  const endDateKey = endDate?.toISOString() ?? null;

  const { data, isLoading, error } = useQuery<AggregatedMeasurement[]>({
    queryKey: [
      'confidenceValues',
      campaignId,
      stationId,
      sensorId,
      interval,
      intervalValue,
      minValue,
      maxValue,
      startDateKey,
      endDateKey,
    ],
    queryFn: async () => {
      const requestParams: GetMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGetRequest =
        {
          campaignId: parseInt(campaignId),
          stationId: parseInt(stationId),
          sensorId: parseInt(sensorId),
          interval: interval,
          intervalValue: intervalValue,
          minValue,
          maxValue,
          startDate,
          endDate,
        };
      return await measurementsApi.getMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGet(
        requestParams,
      );
    },
    // Keep the previous result visible while a new time-range/interval
    // refetches, instead of resetting to undefined. Chart.tsx gates the
    // whole chart on `aggregatedData &&`, so a transient undefined during
    // refetch unmounts UPlotChart, which re-establishes its own initial
    // auto-range on the fresh instance and can cascade into a refetch loop.
    placeholderData: keepPreviousData,
  });

  return { data: data ?? null, isLoading, error: error as Error | null };
};
