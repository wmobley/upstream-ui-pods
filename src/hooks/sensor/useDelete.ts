import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SensorsApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDelete = (campaignId: string, stationId: string) => {
  const config = useConfiguration();
  const sensorsApi = new SensorsApi(config);
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await sensorsApi.deleteSensorApiV1CampaignsCampaignIdStationsStationIdSensorsDelete({
        campaignId: parseInt(campaignId),
        stationId: parseInt(stationId),
      });
    },
    onSuccess: () => {
      // Invalidate related data
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['station', stationId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};