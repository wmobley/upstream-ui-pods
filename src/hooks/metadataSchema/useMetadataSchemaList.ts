import { useQuery } from '@tanstack/react-query';
import useConfiguration from '../api/useConfiguration';
import { MetadataSchemaListResponse, MetadataSchemaScope } from './types';

type UseMetadataSchemaListOptions = {
  scope?: MetadataSchemaScope;
  activeOnly?: boolean;
};

const buildHeaders = (headers?: HeadersInit) => {
  if (!headers) return { Accept: 'application/json' };
  const base = headers instanceof Headers ? Object.fromEntries(headers.entries()) : { ...(headers as Record<string, string>) };
  return {
    ...base,
    Accept: 'application/json',
  };
};

export const useMetadataSchemaList = ({ scope, activeOnly = true }: UseMetadataSchemaListOptions = {}) => {
  const config = useConfiguration();
  const basePath = config.basePath || '';
  const headers = buildHeaders(config.headers);

  return useQuery<MetadataSchemaListResponse, Error>({
    queryKey: ['metadata-schema', scope ?? 'all', activeOnly],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (scope) params.set('scope', scope);
      params.set('active_only', String(activeOnly));
      const response = await fetch(`${basePath}/api/v1/metadata-schema?${params.toString()}`, {
        headers,
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to load metadata schema');
      }
      return response.json();
    },
  });
};
