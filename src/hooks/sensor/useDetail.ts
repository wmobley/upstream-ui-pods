import { useQuery } from '@tanstack/react-query';
import { GetSensorResponse, SensorsApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDetail = (
  campaignId: string,
  stationId: string,
  sensorId: string,
) => {
  const config = useConfiguration();
  const sensorsApi = new SensorsApi(config);

  return useQuery<GetSensorResponse>({
    queryKey: ['sensor', campaignId, stationId, sensorId],
    queryFn: async () => {
      const response =
        await sensorsApi.getSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdGet(
          {
            campaignId: parseInt(campaignId),
            stationId: parseInt(stationId),
            sensorId: parseInt(sensorId),
          },
        );
      return response;
    },
  });
};
