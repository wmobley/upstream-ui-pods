import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StationsApi, PublishRequest, PublishResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface PublishStationRequest {
  campaignId: number;
  stationId: number;
  cascade?: boolean;
  force?: boolean;
}

export const usePublish = () => {
  const config = useConfiguration();
  const stationsApi = new StationsApi(config);
  const queryClient = useQueryClient();

  return useMutation<PublishResponse, Error, PublishStationRequest>({
    mutationFn: async ({ campaignId, stationId, cascade = false, force = false }: PublishStationRequest) => {
      const publishRequest: PublishRequest = { cascade, force };
      try {
        const response = await stationsApi.publishStationApiV1CampaignsCampaignIdStationsStationIdPublishPost({
          campaignId,
          stationId,
          publishRequest,
        });
        return response;
      } catch (err_) {
        const err = err_ as { response?: Response };
        if (err && err.response) {
          try {
            const text = await err.response.text();
            console.error('Station publish API error', {
              url: config.basePath + `/api/v1/campaigns/${campaignId}/stations/${stationId}/publish`,
              status: err.response.status,
              statusText: err.response.statusText,
              body: text,
            });
          } catch {
            console.error('Station publish API error (could not read body)', err_);
          }
        } else {
          console.error('Station publish API error', err_);
        }
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
    onSuccess: (data, variables) => {
      // Update station detail cache so UI reflects published state immediately
      try {
        queryClient.setQueryData(['station', String(variables.stationId)], (old: unknown) => {
          if (!old) return old;
          const oldObj = old as Record<string, unknown>;
          const publishedAt = (data as unknown as { publishedAt?: string }).publishedAt;
          return {
            ...oldObj,
            isPublished: data.isPublished,
            is_published: data.isPublished,
            publishedAt: publishedAt || oldObj['publishedAt'],
            published_at: publishedAt || oldObj['published_at'] || oldObj['publishedAt'],
          };
        });
      } catch {
        // ignore cache set errors
      }

      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['station'] });

      // Ensure station detail query refreshed
      queryClient.invalidateQueries({ queryKey: ['station', String(variables.stationId)] });
    },
    onError: (error, variables) => {
      // If the server reports the station is already published, update the cache so UI shows Unpublish
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
              queryClient.setQueryData(['station', String(variables.stationId)], (old: unknown) => {
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
  });
};

interface UnpublishStationRequest {
  campaignId: number;
  stationId: number;
}

export const useUnpublish = () => {
  const config = useConfiguration();
  const stationsApi = new StationsApi(config);
  const queryClient = useQueryClient();

  return useMutation<PublishResponse, Error, UnpublishStationRequest>({
    mutationFn: async ({ campaignId, stationId }: UnpublishStationRequest) => {
      const response = await stationsApi.unpublishStationApiV1CampaignsCampaignIdStationsStationIdUnpublishPost({
        campaignId,
        stationId,
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['station'] });
    },
  });
};