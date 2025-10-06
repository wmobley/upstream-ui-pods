import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CampaignsApi, PublishRequest, PublishResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface PublishCampaignRequest {
  campaignId: number;
  cascade?: boolean;
  force?: boolean;
}

export const usePublish = () => {
  const config = useConfiguration();
  const campaignsApi = new CampaignsApi(config);
  const queryClient = useQueryClient();

  return useMutation<PublishResponse, Error, PublishCampaignRequest>({
    mutationFn: async ({ campaignId, cascade = false, force = false }: PublishCampaignRequest) => {
      const publishRequest: PublishRequest = { cascade, force };
      try {
        const response = await campaignsApi.publishCampaignApiV1CampaignsCampaignIdPublishPost({
          campaignId,
          publishRequest,
        });
        return response;
  } catch (err_) {
        const err = err_ as { response?: Response };
        if (err && err.response) {
          try {
            const text = await err.response.text();
            console.error('Publish API error', {
              url: config.basePath + `/api/v1/campaigns/${campaignId}/publish`,
              status: err.response.status,
              statusText: err.response.statusText,
              body: text,
            });
          } catch {
            console.error('Publish API error (could not read body)', err_);
          }
        } else {
          console.error('Publish API error', err_);
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
      // If the server reports the campaign is already published, update the cache so UI shows Unpublish
  const body = (error as unknown as Record<string, unknown>).__bodyText as string | undefined;
      try {
        if (body) {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch {
            parsed = body;
          }
          const detail = typeof parsed === 'object' ? parsed.detail : parsed;
          if (detail && String(detail).toLowerCase().includes('already published')) {
            // mark campaign as published in cache
            try {
              queryClient.setQueryData(['campaign', String(variables.campaignId)], (old: unknown) => {
                if (!old) return old;
                const oldObj = old as Record<string, unknown>;
                return {
                  ...oldObj,
                  isPublished: true,
                  is_published: true,
                };
              });
            } catch {
              // ignore
            }
          }
        }
      } catch {
        // ignore parsing errors
      }
    },
    onSuccess: (data, variables) => {
      // Immediately update the campaign detail cache so the UI reflects published state
      try {
        queryClient.setQueryData(['campaign', String(variables.campaignId)], (old: unknown) => {
          if (!old) return old;
          const oldObj = old as Record<string, unknown>;
          const publishedAt = (data as unknown as { publishedAt?: string }).publishedAt;
          return {
            ...oldObj,
            // set both camelCase and snake_case so components can read either
            isPublished: data.isPublished,
            is_published: data.isPublished,
            publishedAt: publishedAt || oldObj['publishedAt'],
            published_at: publishedAt || oldObj['published_at'] || oldObj['publishedAt'],
          };
        });
      } catch {
        // ignore cache set errors
      }

      // Invalidate campaigns list to refresh the cache
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      // Also refetch campaign detail to ensure full consistency
      queryClient.invalidateQueries({ queryKey: ['campaign', String(variables.campaignId)] });
    },
  });
};

export const useUnpublish = () => {
  const config = useConfiguration();
  const campaignsApi = new CampaignsApi(config);
  const queryClient = useQueryClient();

  return useMutation<PublishResponse, Error, number>({
    mutationFn: async (campaignId: number) => {
      const response = await campaignsApi.unpublishCampaignApiV1CampaignsCampaignIdUnpublishPost({
        campaignId,
      });
      return response;
    },
    onSuccess: (data, campaignId) => {
      // Update campaign detail cache if possible
      try {
        queryClient.setQueryData(['campaign', String(campaignId)], (old: unknown) => {
          if (!old) return old;
          const oldObj = old as Record<string, unknown>;
          const publishedAt = (data as unknown as { publishedAt?: string }).publishedAt;
          return {
            ...oldObj,
            isPublished: data.isPublished,
            is_published: data.isPublished,
            publishedAt: publishedAt || null,
            published_at: publishedAt || null,
          };
        });
      } catch {
        // ignore
      }

      // Invalidate campaigns list to refresh the cache
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      // Also refetch campaign detail to ensure full consistency
      queryClient.invalidateQueries({ queryKey: ['campaign', String(campaignId)] });
    },
  });
};