import { useQuery } from '@tanstack/react-query';
import { GetStationResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDetail = (campaignId: string, stationId: string) => {
  const config = useConfiguration();

  const {
    data: station,
    isLoading,
    error,
  } = useQuery<GetStationResponse>({
    queryKey: ['station', campaignId, stationId],
    queryFn: async () => {
      // Use raw fetch to ensure we capture snake_case fields like is_published/published_at
      const url = `${config.basePath}/api/v1/campaigns/${campaignId}/stations/${stationId}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (config.accessToken) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = await (config.accessToken as any)();
        if (token) {
          headers['Authorization'] = String(token).startsWith('Bearer') ? String(token) : `Bearer ${String(token)}`;
        }
      }

      try {
        const resp = await fetch(url, { method: 'GET', headers });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Failed to fetch station: ${resp.status} ${text}`);
        }
        const raw = await resp.json();
        // eslint-disable-next-line no-console
        console.debug('useStationDetail: raw station response', raw);

        const rawRec = raw as Record<string, unknown>;
        const mapped = {
          ...rawRec,
          // normalize publishing fields
          isPublished: (typeof rawRec['isPublished'] === 'boolean') ? rawRec['isPublished'] : (typeof rawRec['is_published'] === 'boolean' ? rawRec['is_published'] : false),
          publishedAt: rawRec['published_at'] ? new Date(String(rawRec['published_at'])) : (rawRec['publishedAt'] as Date | undefined) ?? undefined,
        } as unknown as GetStationResponse;
        // eslint-disable-next-line no-console
        console.debug('useStationDetail: mapped station', mapped);

        return mapped;
      } catch (err_) {
        // runtime.ResponseError thrown by generated client contains the Response
        // Log helpful debug info to the console to diagnose 404s
        const err = err_ as { response?: Response };
        if (err && err.response) {
          try {
            const text = await err.response.text();
            console.error('Stations API error', {
              url: config.basePath + `/api/v1/campaigns/${campaignId}/stations/${stationId}`,
              status: err.response.status,
              statusText: err.response.statusText,
              body: text,
            });
          } catch {
            console.error('Stations API error (could not read body)', err);
          }
        } else {
          console.error('Stations API error', err_);
        }
        throw err_;
      }
    },
    // ensure fresh state on mount
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  return {
    station,
    isLoading,
    error: error as Error | null,
  };
};
