import { useQuery } from '@tanstack/react-query';
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
  limit: number = 500000,
  downsampleThreshold: number | undefined = undefined,
  minMeasurementValue: number | undefined = undefined,
  maxMeasurementValue: number | undefined = undefined,
  startDate: Date | null | undefined = undefined,
  endDate: Date | null | undefined = undefined,
): UseDetailReturn => {
  const config = useConfiguration();
  const measurementsApi = new MeasurementsApi(config);
  const startDateKey = startDate?.toISOString() ?? null;
  const endDateKey = endDate?.toISOString() ?? null;

  const { data, isLoading, error } =
    useQuery<ListMeasurementsResponsePagination>({
      queryKey: [
        'measurements',
        campaignId,
        stationId,
        sensorId,
        limit,
        downsampleThreshold,
        minMeasurementValue,
        maxMeasurementValue,
        startDateKey,
        endDateKey,
      ],
      queryFn: async () => {
        const response =
          await measurementsApi.getSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGet(
            {
              campaignId: parseInt(campaignId),
              stationId: parseInt(stationId),
              sensorId: parseInt(sensorId),
              downsampleThreshold,
              minMeasurementValue,
              maxMeasurementValue,
              startDate,
              endDate,
              limit,
            },
          );
        return response;
      },
    });

  return { data: data ?? null, isLoading, error: error as Error | null };
};
