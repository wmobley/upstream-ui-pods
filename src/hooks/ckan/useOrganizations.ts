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
        throw new Error(text || `Failed to fetch CKAN organizations (${response.status})`);
      }
      return (await response.json()) as CkanOrganization[];
    },
  });

  return query;
};

export default useOrganizations;
