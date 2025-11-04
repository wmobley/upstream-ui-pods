import { useQuery } from '@tanstack/react-query';
import useConfiguration from '../api/useConfiguration';

export interface CkanOrganization {
  name: string;
  display_name: string;
  capacity?: string;
  title?: string;
}

export const useOrganizations = () => {
  const config = useConfiguration();

  const query = useQuery<CkanOrganization[], Error>({
    queryKey: ['ckan-organizations'],
    queryFn: async () => {
      const url = `${config.basePath}/api/v1/ckan/organizations`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(config.headers as Record<string, string> | undefined),
      };

      // If the upstream configuration provided a Tapis token header, prefer
      // that and remove any Authorization header that may come from other
      // auth flows to avoid sending conflicting auth headers.
      if (headers['X-TAPIS-TOKEN'] || headers['X-Tapis-Token'] || headers['x-tapis-token']) {
        delete headers['Authorization'];
        delete headers['authorization'];
      }

      // Ensure we request JSON
      headers['Accept'] = headers['Accept'] || 'application/json';
  console.debug('[CKAN] Requesting organizations from %s', url);
  // Debug final headers to help diagnose which auth header is being sent
  // (X-TAPIS-TOKEN vs Authorization). Remove this once the issue is resolved.
  // Note: token values will be printed in console; avoid sharing them.
  //
  // Example output to look for: headers['X-TAPIS-TOKEN'] should be present
  // and headers['Authorization'] should be undefined when running inside a
  // Tapis pod.
  //
  console.debug('[CKAN] Final request headers:', headers);

      if (config.accessToken) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = await (config.accessToken as any)();
        if (token) {
          headers['Authorization'] = token;
        }
      }

      const response = await fetch(url, { method: 'GET', headers });
      if (!response.ok) {
        const text = await response.text();
        console.error('[CKAN] Failed to fetch organizations (%s): %s', response.status, text);
        throw new Error(text || `Failed to fetch CKAN organizations (${response.status})`);
      }
      const cloned = response.clone();
      const rawText = await cloned.text();
      console.debug('[CKAN] Raw organizations response:', rawText);
      const result = JSON.parse(rawText) as CkanOrganization[];
      console.debug('[CKAN] Retrieved %d organizations', result.length);
      return result;
    },
  });

  return query;
};

export default useOrganizations;
