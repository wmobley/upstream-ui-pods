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
        return await stationsApi.publishStationApiV1CampaignsCampaignIdStationsStationIdPublishPost({
          campaignId,
          stationId,
          publishRequest,
        });
      } catch (err_) {
        const err = err_ as { response?: Response };
        if (err && err.response) {
          try {
            const body = await err.response.text();
            console.error('Station publish API error', {
              url: `${config.basePath}/api/v1/campaigns/${campaignId}/stations/${stationId}/publish`,
              status: err.response.status,
              statusText: err.response.statusText,
              body,
            });
            (err_ as unknown as Record<string, unknown>).__bodyText = body;
          } catch {
            console.error('Station publish API error (could not read body)', err_);
          }
        } else {
          console.error('Station publish API error', err_);
        }
        throw err_;
      }
    },
    onSuccess: (data, variables) => {
      try {
        queryClient.setQueryData(['station', String(variables.campaignId), String(variables.stationId)], (old: unknown) => {
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

      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['station'] });
      queryClient.invalidateQueries({ queryKey: ['station', String(variables.campaignId), String(variables.stationId)] });
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
      try {
        return await stationsApi.unpublishStationApiV1CampaignsCampaignIdStationsStationIdUnpublishPost({
          campaignId,
          stationId,
        });
      } catch (err_) {
        const err = err_ as { response?: Response };
        if (err && err.response) {
          try {
            const body = await err.response.text();
            console.error('Station unpublish API error', {
              url: `${config.basePath}/api/v1/campaigns/${campaignId}/stations/${stationId}/unpublish`,
              status: err.response.status,
              statusText: err.response.statusText,
              body,
            });
            (err_ as unknown as Record<string, unknown>).__bodyText = body;
          } catch {
            console.error('Station unpublish API error (could not read body)', err_);
          }
        } else {
          console.error('Station unpublish API error', err_);
        }
        throw err_;
      }
    },
    onSuccess: (_, variables) => {
      try {
        queryClient.setQueryData(['station', String(variables.campaignId), String(variables.stationId)], (old: unknown) => {
          if (!old) return old;
          const oldObj = old as Record<string, unknown>;
          return {
            ...oldObj,
            isPublished: false,
            is_published: false,
          };
        });
      } catch {
        // ignore cache errors
      }

      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['station'] });
      queryClient.invalidateQueries({ queryKey: ['station', String(variables.campaignId), String(variables.stationId)] });
    },
  });
};
