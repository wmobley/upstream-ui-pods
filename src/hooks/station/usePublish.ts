import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PublishRequest, Configuration } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';
import {
  appendPublishRequestId,
  createPublishRequestId,
  ensurePublishSucceeded,
  logPublishResponse,
  parsePublishResponseText,
  PublishDebugResponse,
} from '../api/publishDebug';

interface PublishStationRequest {
  campaignId: number;
  stationId: number;
  cascade?: boolean;
  force?: boolean;
}

const summarizeToken = (token: string | null | undefined) => ({
  exists: Boolean(token),
  length: token ? token.length : null,
  dots: token ? (token.match(/\./g) || []).length : null,
  prefix: token ? token.slice(0, 16) : null,
  suffix: token ? token.slice(-16) : null,
});

export const usePublish = () => {
  const config = useConfiguration();

  // Forward Tapis token for CKAN operations when present in sessionStorage.
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

  return useMutation<PublishDebugResponse, Error, PublishStationRequest>({
    mutationFn: async ({ campaignId, stationId, cascade = false, force = false }: PublishStationRequest) => {
      const publishRequest: PublishRequest = { cascade, force };
      const requestId = createPublishRequestId('station', [campaignId, stationId]);
      const url = appendPublishRequestId(
        `${apiConfig.basePath}/api/v1/campaigns/${campaignId}/stations/${stationId}/publish`,
        requestId
      );
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...((apiConfig.headers as Record<string, string> | undefined) || {}),
      };
      const rawXTapisToken = headers['X-TAPIS-TOKEN'] || headers['X-Tapis-Token'] || headers['x-tapis-token'] || null;
      const rawAuthorization = headers['Authorization'] || headers['authorization'] || null;
      console.info('[publish][station] request', {
        requestId,
        campaignId,
        stationId,
        publishRequest,
        tapisToken: summarizeToken(tapisToken),
      });
      console.debug('[publish][station] headers', {
        requestId,
        headers,
        apiConfigHeaders: apiConfig.headers,
        tapisTokenInSession: Boolean(tapisToken),
      });
      console.debug('[publish][station] headers-debug', {
        requestId,
        xTapisTokenPresent: Boolean(rawXTapisToken),
        xTapisTokenSummary: rawXTapisToken ? summarizeToken(rawXTapisToken) : null,
        authorizationPresent: Boolean(rawAuthorization),
        authorizationSummary: rawAuthorization
          ? summarizeToken(rawAuthorization.replace(/^Bearer\s+/i, ''))
          : null,
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
              ? `Station publish API error: ${resp.status} ${detail}`
              : `Station publish API error: ${resp.status} ${resp.statusText}`
          );
          (error as unknown as Record<string, unknown>).__bodyText = text;
          (error as unknown as Record<string, unknown>).__requestId = requestId;
          (error as unknown as Record<string, unknown>).__publishResponse = response;
          throw error;
        }
        logPublishResponse('station', requestId, response);
        return ensurePublishSucceeded('station', requestId, response);
      } catch (err_) {
        const err = err_ as { response?: Response };
        if (err && err.response) {
          try {
            const body = await err.response.text();
            console.error('Station publish API error', {
              url: `${config.basePath}/api/v1/campaigns/${campaignId}/stations/${stationId}/publish`,
              status: err.response.status,
              statusText: err.response.statusText,
              requestId,
              body,
            });
            (err_ as unknown as Record<string, unknown>).__bodyText = body;
          } catch {
            console.error('Station publish API error (could not read body)', err_);
          }
        } else {
          console.error('Station publish API error', err_);
        }
        (err_ as unknown as Record<string, unknown>).__requestId = requestId;
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

  return useMutation<PublishDebugResponse, Error, UnpublishStationRequest>({
    mutationFn: async ({ campaignId, stationId }: UnpublishStationRequest) => {
      const requestId = createPublishRequestId('station', [campaignId, stationId, 'unpublish']);
      const url = appendPublishRequestId(
        `${apiConfig.basePath}/api/v1/campaigns/${campaignId}/stations/${stationId}/unpublish`,
        requestId
      );
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...((apiConfig.headers as Record<string, string> | undefined) || {}),
      };
      console.info('[publish][station] unpublish request', {
        requestId,
        campaignId,
        stationId,
        tapisToken: summarizeToken(tapisToken),
      });
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers,
        });
        const text = await resp.text();
        const response = JSON.parse(text) as PublishDebugResponse;
        if (!resp.ok) {
          const error = new Error(`Station unpublish API error: ${resp.status} ${resp.statusText}`);
          (error as unknown as Record<string, unknown>).__bodyText = text;
          (error as unknown as Record<string, unknown>).__requestId = requestId;
          throw error;
        }
        logPublishResponse('station', requestId, response);
        return response;
      } catch (err_) {
        const err = err_ as { response?: Response };
        if (err && err.response) {
          try {
            const body = await err.response.text();
            console.error('Station unpublish API error', {
              url: `${config.basePath}/api/v1/campaigns/${campaignId}/stations/${stationId}/unpublish`,
              status: err.response.status,
              statusText: err.response.statusText,
              requestId,
              body,
            });
            (err_ as unknown as Record<string, unknown>).__bodyText = body;
          } catch {
            console.error('Station unpublish API error (could not read body)', err_);
          }
        } else {
          console.error('Station unpublish API error', err_);
        }
        (err_ as unknown as Record<string, unknown>).__requestId = requestId;
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
