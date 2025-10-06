import { useQuery } from '@tanstack/react-query';
import { GetSensorResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDetail = (
  campaignId: string,
  stationId: string,
  sensorId: string,
) => {
  const config = useConfiguration();

  return useQuery<GetSensorResponse>({
    queryKey: ['sensor', campaignId, stationId, sensorId],
    queryFn: async () => {
      const url = `${config.basePath}/api/v1/campaigns/${campaignId}/stations/${stationId}/sensors/${sensorId}`;
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

      const resp = await fetch(url, { method: 'GET', headers });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Failed to fetch sensor: ${resp.status} ${text}`);
      }
      const raw = await resp.json();
      // eslint-disable-next-line no-console
      console.debug('useSensorDetail: raw sensor response', raw);

      const rawRec = raw as Record<string, unknown>;
      const mapped = {
        ...rawRec,
        isPublished: (typeof rawRec['isPublished'] === 'boolean') ? rawRec['isPublished'] : (typeof rawRec['is_published'] === 'boolean' ? rawRec['is_published'] : false),
        publishedAt: rawRec['published_at'] ? new Date(String(rawRec['published_at'])) : (rawRec['publishedAt'] as Date | undefined) ?? undefined,
      } as unknown as GetSensorResponse;
      // eslint-disable-next-line no-console
      console.debug('useSensorDetail: mapped sensor', mapped);

      return mapped;
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });
};
