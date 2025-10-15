import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MeasurementsApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDeleteBySensor = () => {
  const config = useConfiguration();
  const measurementsApi = new MeasurementsApi(config);
  const queryClient = useQueryClient();

  return useMutation<void, Error, { campaignId: string; stationId: string; sensorId: string }>({
    mutationFn: async ({ campaignId, stationId, sensorId }) => {
      await measurementsApi.deleteSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsDelete({
        campaignId: parseInt(campaignId),
        stationId: parseInt(stationId),
        sensorId: parseInt(sensorId),
      });
    },
    onSuccess: (_, { campaignId, stationId, sensorId }) => {
      // Invalidate related data
      queryClient.invalidateQueries({ queryKey: ['measurements', campaignId, stationId, sensorId] });
      queryClient.invalidateQueries({ queryKey: ['sensor', sensorId] });
      queryClient.invalidateQueries({ queryKey: ['sensors', campaignId, stationId] });
      queryClient.invalidateQueries({ queryKey: ['station', stationId] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    },
  });
};