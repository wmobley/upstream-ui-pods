import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SensorsApi, PublishRequest, PublishResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface PublishSensorRequest {
  campaignId: number;
  stationId: number;
  sensorId: number;
  cascade?: boolean;
  force?: boolean;
}

export const usePublish = () => {
  const config = useConfiguration();
  const sensorsApi = new SensorsApi(config);
  const queryClient = useQueryClient();

  return useMutation<PublishResponse, Error, PublishSensorRequest>({
    mutationFn: async ({ campaignId, stationId, sensorId, cascade = false, force = false }: PublishSensorRequest) => {
      const publishRequest: PublishRequest = { cascade, force };
      try {
        const response = await sensorsApi.publishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPublishPost({
          campaignId,
          stationId,
          sensorId,
          publishRequest,
        });
        return response;
      } catch (err_) {
        const err = err_ as { response?: Response };
        if (err && err.response) {
          try {
            const text = await err.response.text();
            console.error('Sensor publish API error', {
              url: config.basePath + `/api/v1/campaigns/${campaignId}/stations/${stationId}/sensors/${sensorId}/publish`,
              status: err.response.status,
              statusText: err.response.statusText,
              body: text,
            });
          } catch {
            console.error('Sensor publish API error (could not read body)', err_);
          }
        } else {
          console.error('Sensor publish API error', err_);
        }
        // attach the response body to the thrown error so downstream handlers can inspect it
        try {
          const resp = (err_ as unknown as { response?: Response }).response;
          if (resp) {
            (err_ as unknown as Record<string, unknown>).__bodyText = await resp.text();
          }
        } catch {
          // ignore
        }
        throw err_;
      }
    },
    onError: (error, variables) => {
      // If the server reports the sensor is already published, update the cache so UI shows Unpublish
      const body = (error as unknown as Record<string, unknown>).__bodyText as string | undefined;
      try {
        if (body) {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch {
            parsed = body;
          }
          const parsedObj = parsed as unknown as Record<string, unknown>;
          const detail = typeof parsed === 'object' && parsed !== null && 'detail' in parsedObj
            ? parsedObj['detail']
            : parsed;
          if (detail && String(detail).toLowerCase().includes('already published')) {
            try {
              queryClient.setQueryData(['sensor', String(variables.campaignId), String(variables.stationId), String(variables.sensorId)], (old: unknown) => {
                if (!old) return old;
                const oldObj = old as Record<string, unknown>;
                return {
                  ...oldObj,
                  isPublished: true,
                  is_published: true,
                };
              });
            } catch {
              // ignore cache set errors
            }
          }
        }
      } catch {
        // ignore parsing errors
      }
    },
  onSuccess: () => {
      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['station'] });
      queryClient.invalidateQueries({ queryKey: ['sensors'] });
      queryClient.invalidateQueries({ queryKey: ['sensor'] });
    },
  });
};

interface UnpublishSensorRequest {
  campaignId: number;
  stationId: number;
  sensorId: number;
}

export const useUnpublish = () => {
  const config = useConfiguration();
  const sensorsApi = new SensorsApi(config);
  const queryClient = useQueryClient();

  return useMutation<PublishResponse, Error, UnpublishSensorRequest>({
    mutationFn: async ({ campaignId, stationId, sensorId }: UnpublishSensorRequest) => {
      const response = await sensorsApi.unpublishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdUnpublishPost({
        campaignId,
        stationId,
        sensorId,
      });
      return response;
    },
  onSuccess: () => {
      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['station'] });
      queryClient.invalidateQueries({ queryKey: ['sensors'] });
      queryClient.invalidateQueries({ queryKey: ['sensor'] });
    },
  });
};