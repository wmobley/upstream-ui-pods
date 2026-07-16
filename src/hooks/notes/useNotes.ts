import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useConfiguration from '../api/useConfiguration';
import type { ListNotesResponse } from './types';

function notesUrl(basePath: string, path: string): string {
  return `${basePath.replace(/\/+$/, '')}/api/v1${path}`;
}

function useNotesFetch() {
  const config = useConfiguration();
  return async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config.headers as Record<string, string> | undefined ?? {}),
    };
    return fetch(url, { ...options, headers });
  };
}

export function useCampaignNotes(campaignId: number) {
  const config = useConfiguration();
  const apiFetch = useNotesFetch();
  return useQuery<ListNotesResponse>({
    queryKey: ['notes', 'campaign', campaignId],
    queryFn: async () => {
      const res = await apiFetch(notesUrl(config.basePath ?? '', `/campaigns/${campaignId}/notes`));
      if (!res.ok) throw new Error('Failed to fetch campaign notes');
      return res.json();
    },
    enabled: Boolean(config.basePath),
  });
}

export function useStationNotes(campaignId: number, stationId: number) {
  const config = useConfiguration();
  const apiFetch = useNotesFetch();
  return useQuery<ListNotesResponse>({
    queryKey: ['notes', 'station', campaignId, stationId],
    queryFn: async () => {
      const res = await apiFetch(
        notesUrl(config.basePath ?? '', `/campaigns/${campaignId}/stations/${stationId}/notes`)
      );
      if (!res.ok) throw new Error('Failed to fetch station notes');
      return res.json();
    },
    enabled: Boolean(config.basePath),
  });
}

export function useMeasurementNotes(
  campaignId: number,
  stationId: number,
  sensorId: number,
  measurementId: number
) {
  const config = useConfiguration();
  const apiFetch = useNotesFetch();
  return useQuery<ListNotesResponse>({
    queryKey: ['notes', 'measurement', campaignId, stationId, measurementId],
    queryFn: async () => {
      const res = await apiFetch(
        notesUrl(
          config.basePath ?? '',
          `/campaigns/${campaignId}/stations/${stationId}/sensors/${sensorId}/measurements/${measurementId}/notes`
        )
      );
      if (!res.ok) throw new Error('Failed to fetch measurement notes');
      return res.json();
    },
    enabled: Boolean(config.basePath),
  });
}

export function useCreateCampaignNote(campaignId: number) {
  const queryClient = useQueryClient();
  const apiFetch = useNotesFetch();
  const config = useConfiguration();
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await apiFetch(
        notesUrl(config.basePath ?? '', `/campaigns/${campaignId}/notes`),
        { method: 'POST', body: JSON.stringify({ content }) }
      );
      if (!res.ok) throw new Error('Failed to create note');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes', 'campaign', campaignId] }),
  });
}

export function useCreateStationNote(campaignId: number, stationId: number) {
  const queryClient = useQueryClient();
  const apiFetch = useNotesFetch();
  const config = useConfiguration();
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await apiFetch(
        notesUrl(config.basePath ?? '', `/campaigns/${campaignId}/stations/${stationId}/notes`),
        { method: 'POST', body: JSON.stringify({ content }) }
      );
      if (!res.ok) throw new Error('Failed to create note');
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['notes', 'station', campaignId, stationId] }),
  });
}

export function useCreateMeasurementNote(
  campaignId: number,
  stationId: number,
  sensorId: number,
  measurementId: number
) {
  const queryClient = useQueryClient();
  const apiFetch = useNotesFetch();
  const config = useConfiguration();
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await apiFetch(
        notesUrl(
          config.basePath ?? '',
          `/campaigns/${campaignId}/stations/${stationId}/sensors/${sensorId}/measurements/${measurementId}/notes`
        ),
        { method: 'POST', body: JSON.stringify({ content }) }
      );
      if (!res.ok) throw new Error('Failed to create note');
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['notes', 'measurement', campaignId, stationId, measurementId],
      }),
  });
}

export function useDeleteNote(queryKey: unknown[]) {
  const queryClient = useQueryClient();
  const apiFetch = useNotesFetch();
  const config = useConfiguration();
  return useMutation({
    mutationFn: async ({ noteId, deletePath }: { noteId: number; deletePath: string }) => {
      const res = await apiFetch(notesUrl(config.basePath ?? '', deletePath), {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete note');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
