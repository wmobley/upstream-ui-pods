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
): UseDetailReturn => {
  const config = useConfiguration();
  const measurementsApi = new MeasurementsApi(config);

  const { data, isLoading, error } =
    useQuery<ListMeasurementsResponsePagination>({
      queryKey: [
        'measurements',
        campaignId,
        stationId,
        sensorId,
        limit,
        downsampleThreshold,
      ],
      queryFn: async () => {
        const response =
          await measurementsApi.getSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGet(
            {
              campaignId: parseInt(campaignId),
              stationId: parseInt(stationId),
              sensorId: parseInt(sensorId),
              downsampleThreshold,
              minMeasurementValue: 0,
              limit,
            },
          );
        return response;
      },
    });

  return { data: data ?? null, isLoading, error: error as Error | null };
};
