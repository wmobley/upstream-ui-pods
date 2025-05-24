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

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'measurements',
      campaignId,
      stationId,
      sensorId,
      limit,
      downsampleThreshold,
      startDate,
      endDate,
    ],
    queryFn: async () => {
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
      return response;
    },
  });

  return { data: data ?? null, isLoading, error: error as Error | null };
};
