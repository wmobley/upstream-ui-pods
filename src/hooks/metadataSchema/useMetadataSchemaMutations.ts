import { useMutation, useQueryClient } from '@tanstack/react-query';
import useConfiguration from '../api/useConfiguration';
import { MetadataSchemaItem } from './types';

const buildHeaders = (headers?: HeadersInit) => {
  if (!headers) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }
  const base = headers instanceof Headers ? Object.fromEntries(headers.entries()) : { ...(headers as Record<string, string>) };
  return {
    ...base,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
};

export const useCreateMetadataSchema = () => {
  const config = useConfiguration();
  const queryClient = useQueryClient();
  const basePath = config.basePath || '';
  const headers = buildHeaders(config.headers);

  return useMutation<MetadataSchemaItem, Error, Omit<MetadataSchemaItem, 'id'>>({
    mutationFn: async (payload) => {
      const response = await fetch(`${basePath}/api/v1/metadata-schema`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to create metadata schema');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metadata-schema'] });
    },
  });
};

export const useUpdateMetadataSchema = () => {
  const config = useConfiguration();
  const queryClient = useQueryClient();
  const basePath = config.basePath || '';
  const headers = buildHeaders(config.headers);

  return useMutation<MetadataSchemaItem, Error, { id: number; patch: Partial<MetadataSchemaItem> }>({
    mutationFn: async ({ id, patch }) => {
      const response = await fetch(`${basePath}/api/v1/metadata-schema/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(patch),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to update metadata schema');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metadata-schema'] });
    },
  });
};

export const useDeleteMetadataSchema = () => {
  const config = useConfiguration();
  const queryClient = useQueryClient();
  const basePath = config.basePath || '';
  const headers = buildHeaders(config.headers);

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      const response = await fetch(`${basePath}/api/v1/metadata-schema/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to delete metadata schema');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metadata-schema'] });
    },
  });
};
