import { useState } from 'react';
import { useList } from '../../../hooks/measurements/useList';
import {
  useMeasurementNotes,
  useCreateMeasurementNote,
  useDeleteNote,
  useUpdateNote,
} from '../../../hooks/notes/useNotes';
import { NotesList } from '../../common/Notes/NotesList';
import { useAuth } from '../../../contexts/AuthContextState';

interface Props {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

export function MeasurementNotePanel({ campaignId, stationId, sensorId }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const { username } = useAuth();
  const { data, isLoading } = useList(campaignId, stationId, sensorId, 20);
  const measurements = data?.items ?? [];

  const campaignIdNum = parseInt(campaignId);
  const stationIdNum = parseInt(stationId);
  const sensorIdNum = parseInt(sensorId);

  const noteQueryKey = selectedId
    ? ['notes', 'measurement', campaignIdNum, stationIdNum, selectedId]
    : [];

  const { data: notesData, isLoading: notesLoading } = useMeasurementNotes(
    campaignIdNum,
    stationIdNum,
    sensorIdNum,
    selectedId ?? 0,
  );
  const createNote = useCreateMeasurementNote(campaignIdNum, stationIdNum, sensorIdNum, selectedId ?? 0);
  const deleteNote = useDeleteNote(noteQueryKey);
  const updateNote = useUpdateNote(noteQueryKey);

  return (
    <div className="rounded border border-gray-200 bg-white">
      <button
        className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Measurement Notes</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-gray-200 px-4 pb-4 pt-2 space-y-3">
          <p className="text-xs text-gray-500">
            Select a measurement to view or add notes.
          </p>

          {isLoading ? (
            <p className="text-sm text-gray-400">Loading measurements…</p>
          ) : measurements.length === 0 ? (
            <p className="text-sm text-gray-400">No measurements available.</p>
          ) : (
            <div className="max-h-48 overflow-y-auto rounded border border-gray-100">
              {measurements.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id === selectedId ? null : m.id)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm border-b last:border-b-0 transition-colors ${
                    m.id === selectedId
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>
                    {new Date(m.collectiontime).toLocaleString(undefined, {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                  <span className="text-gray-500">{m.value}</span>
                </button>
              ))}
            </div>
          )}

          {selectedId !== null && (
            <NotesList
              notes={notesData?.items ?? []}
              isLoading={notesLoading}
              currentUsername={username ?? undefined}
              canWrite={Boolean(username)}
              onAdd={(content) => createNote.mutate(content)}
              onDelete={(noteId) =>
                deleteNote.mutate({
                  noteId,
                  deletePath: `/campaigns/${campaignIdNum}/stations/${stationIdNum}/sensors/${sensorIdNum}/measurements/${selectedId}/notes/${noteId}`,
                })
              }
              onUpdate={(noteId, content) =>
                updateNote.mutate({
                  updatePath: `/campaigns/${campaignIdNum}/stations/${stationIdNum}/sensors/${sensorIdNum}/measurements/${selectedId}/notes/${noteId}`,
                  content,
                })
              }
              isAdding={createNote.isPending}
              isDeleting={deleteNote.isPending}
              isUpdating={updateNote.isPending}
            />
          )}
        </div>
      )}
    </div>
  );
}
