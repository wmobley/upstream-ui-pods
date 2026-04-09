import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PublishRequest, Configuration } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';
import {
  appendPublishRequestId,
  createPublishRequestId,
  ensurePublishSucceeded,
  logPublishResponse,
  PublishDebugResponse,
  parsePublishResponseText,
} from '../api/publishDebug';

interface PublishCampaignRequest {
  campaignId: number;
  cascade?: boolean;
  force?: boolean;
}

export const usePublish = () => {
  const config = useConfiguration();
  const tapisToken = typeof window !== 'undefined' ? sessionStorage.getItem('Tapis-Access-Token') : null;
  let apiConfig = config;
  if (tapisToken) {
    const headers: Record<string, string> = {
      ...(config.headers as Record<string, string> | undefined),
      'X-TAPIS-TOKEN': tapisToken,
    };
    apiConfig = new Configuration({ basePath: config.basePath, headers, accessToken: config.accessToken });
  }
  const queryClient = useQueryClient();

  return useMutation<PublishDebugResponse, Error, PublishCampaignRequest>({
    mutationFn: async ({ campaignId, cascade = false, force = false }: PublishCampaignRequest) => {
      const publishRequest: PublishRequest = { cascade, force };
      const requestId = createPublishRequestId('campaign', [campaignId]);
      const url = appendPublishRequestId(
        `${apiConfig.basePath}/api/v1/campaigns/${campaignId}/publish`,
        requestId
      );
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...((apiConfig.headers as Record<string, string> | undefined) || {}),
      };
      console.info('[publish][campaign] request', {
        requestId,
        campaignId,
        publishRequest,
      });
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(publishRequest),
        });
        const text = await resp.text();
        const response = parsePublishResponseText(text);
        if (!resp.ok) {
          const detail =
            response?.message ||
            response?.detail ||
            (Array.isArray(response?.errors) && response.errors.length
              ? response.errors.join('; ')
              : null);
          const error = new Error(
            detail
              ? `Publish API error: ${resp.status} ${detail}`
              : `Publish API error: ${resp.status} ${resp.statusText}`,
          );
          (error as unknown as Record<string, unknown>).__bodyText = text;
          (error as unknown as Record<string, unknown>).__requestId = requestId;
          (error as unknown as Record<string, unknown>).__publishResponse = response;
          throw error;
        }
        logPublishResponse('campaign', requestId, response);
        return ensurePublishSucceeded('campaign', requestId, response);
      } catch (err_) {
        const err = err_ as { response?: Response };
        if (err && err.response) {
          try {
            const text = await err.response.text();
            console.error('Publish API error', {
              url: config.basePath + `/api/v1/campaigns/${campaignId}/publish`,
              status: err.response.status,
              statusText: err.response.statusText,
              requestId,
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
        (err_ as unknown as Record<string, unknown>).__requestId = requestId;
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
  const tapisToken = typeof window !== 'undefined' ? sessionStorage.getItem('Tapis-Access-Token') : null;
  let apiConfig = config;
  if (tapisToken) {
    const headers: Record<string, string> = {
      ...(config.headers as Record<string, string> | undefined),
      'X-TAPIS-TOKEN': tapisToken,
    };
    apiConfig = new Configuration({ basePath: config.basePath, headers, accessToken: config.accessToken });
  }
  const queryClient = useQueryClient();

  return useMutation<PublishDebugResponse, Error, number>({
    mutationFn: async (campaignId: number) => {
      const requestId = createPublishRequestId('campaign', [campaignId, 'unpublish']);
      const url = appendPublishRequestId(
        `${apiConfig.basePath}/api/v1/campaigns/${campaignId}/unpublish`,
        requestId
      );
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...((apiConfig.headers as Record<string, string> | undefined) || {}),
      };
      console.info('[publish][campaign] unpublish request', {
        requestId,
        campaignId,
      });
      const resp = await fetch(url, {
        method: 'POST',
        headers,
      });
      const text = await resp.text();
      const response = parsePublishResponseText(text);
      if (!resp.ok) {
        const detail =
          response?.message ||
          response?.detail ||
          (Array.isArray(response?.errors) && response.errors.length
            ? response.errors.join('; ')
            : null);
        throw new Error(
          detail
            ? `Unpublish API error: ${resp.status} ${detail}`
            : `Unpublish API error: ${resp.status} ${resp.statusText}`,
        );
      }
      logPublishResponse('campaign', requestId, response);
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
