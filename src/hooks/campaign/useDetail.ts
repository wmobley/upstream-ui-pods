import { useQuery } from '@tanstack/react-query';
import { GetCampaignResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDetail = (campaignId: string) => {
  const config = useConfiguration();
  // use raw fetch with config for headers; no need to instantiate generated client here

  const {
    data: campaign,
    isLoading,
    error,
  } = useQuery<GetCampaignResponse, Error>({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      // Use the generated client to build headers/auth, but fetch raw JSON to
      // ensure we capture snake_case fields like is_published/published_at.
      const url = `${config.basePath}/api/v1/campaigns/${campaignId}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        // Include Tapis headers if present
        ...(config.headers as Record<string, string> || {}),
      };

      // `Configuration.accessToken` from the generated client is a function
      // that returns a token (or a Promise). Call/await it when present.
      if (config.accessToken) {
        // accessToken can be a sync or async function; ensure we await the result
        // and prefix with 'Bearer ' if not already present.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = await (config.accessToken as any)();
        if (token) {
          headers['Authorization'] = String(token).startsWith('Bearer') ? String(token) : `Bearer ${String(token)}`;
        }
      }
      console.log(url)
      const resp = await fetch(url, { method: 'GET', headers });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Failed to fetch campaign: ${resp.status} ${text}`);
      }

      const raw = await resp.json();
  // Debug: print raw server response so browser console shows snake_case fields
  // eslint-disable-next-line no-console
  console.debug('useDetail: raw campaign response', raw);

      // Map server snake_case fields to camelCase used in client models
      const rawRec = raw as Record<string, unknown>;
      const mapped = {
        ...rawRec,
        isPublished: rawRec['is_published'] ?? rawRec['isPublished'],
        publishedAt: rawRec['published_at'] ? new Date(String(rawRec['published_at'])) : (rawRec['publishedAt'] as Date | undefined) ?? undefined,
      } as unknown as GetCampaignResponse;
      // eslint-disable-next-line no-console
      console.debug('useDetail: mapped campaign', mapped);

      return mapped;
    },
    // ensure we always get the fresh published state from the server when
    // the dashboard mounts (avoids showing stale cached data)
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  return {
    campaign,
    isLoading,
    error,
  };
};
