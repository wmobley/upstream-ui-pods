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

      // If a tapis token was stored in sessionStorage (from login), use it
      // explicitly for CKAN requests by forwarding it as X-TAPIS-TOKEN. This
      // ensures CKAN calls receive the tapis_access_token while keeping the
      // application's Authorization: Bearer available for other endpoints.
      try {
        const tapisTokenFromSession = typeof window !== 'undefined' ? sessionStorage.getItem('Tapis-Access-Token') : null;
        if (tapisTokenFromSession) {
          const headerMap = headers as Record<string, string>;
          headerMap['X-TAPIS-TOKEN'] = tapisTokenFromSession;
          // Prevent sending Authorization alongside X-TAPIS-TOKEN to avoid
          // confusing the backend auth resolution.
          delete headerMap['Authorization'];
          delete headerMap['authorization'];
        }
      } catch {
        // sessionStorage may be unavailable; ignore and continue.
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
      // Also log the tapis token if present (from headers or sessionStorage)
      try {
        const headerMap = headers as Record<string, string>;
        const tapisTokenFromHeaders =
          headerMap['X-TAPIS-TOKEN'] ||
          headerMap['X-Tapis-Token'] ||
          headerMap['x-tapis-token'];
        const tapisTokenFromSession =
          typeof window !== 'undefined' ? sessionStorage.getItem('Tapis-Access-Token') : null;
        const tapisToken = tapisTokenFromHeaders || tapisTokenFromSession;
        console.debug('[CKAN] Tapis token (headers/sessionStorage):', tapisToken);
      } catch (err) {
        console.debug('[CKAN] Unable to read tapis token for debug', err);
      }

        if (config.accessToken) {
          const token = await config.accessToken();
          // Only attach an Authorization header if a Tapis token header is
          // NOT already present. This prevents the local JWT from overwriting
          // or conflicting with the X-TAPIS-TOKEN header when running inside
          // a Tapis pod or when the tapis token is stored in sessionStorage.
          const hasTapisToken = Boolean(
            headers['X-TAPIS-TOKEN'] || headers['X-Tapis-Token'] || headers['x-tapis-token'],
          );
          if (token && !hasTapisToken) {
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
      console.debug('[CKAN] Raw organizations response:', response);
      const result = JSON.parse(rawText) as CkanOrganization[];
      console.debug('[CKAN] Retrieved %d organizations', result.length);
      return result;
    },
  });

  return query;
};

export default useOrganizations;
