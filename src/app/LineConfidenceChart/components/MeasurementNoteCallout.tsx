import React from 'react';
import NumberFormatter from '../../common/NumberFormatter/NumberFormatter';
import { NotesList } from '../../common/Notes/NotesList';
import GeometryMap from '../../common/GeometryMap/GeometryMap';
import { hasValidGeometry } from '../../../utils/geometryValidation';
import { useAuth } from '../../../contexts/AuthContextState';
import {
  useMeasurementNotes,
  useCreateMeasurementNote,
  useDeleteNote,
  useUpdateNote,
} from '../../../hooks/notes/useNotes';

export interface SelectedPointPayload {
  x: number;
  y: number;
  measurementId: number;
  timestamp: Date;
  value: number;
  campaignId: string;
  stationId: string;
  sensorId: string;
  bucketContext?: { averageValue: number; pointCount: number } | null;
  geometry?: GeoJSON.Point | null;
}

interface MeasurementNoteCalloutProps {
  point: SelectedPointPayload;
  onClose: () => void;
}

const MeasurementNoteCallout: React.FC<MeasurementNoteCalloutProps> = ({
  point,
  onClose,
}) => {
  const { username } = useAuth();
  const campaignIdNum = parseInt(point.campaignId);
  const stationIdNum = parseInt(point.stationId);
  const sensorIdNum = parseInt(point.sensorId);

  const { data: notesData, isLoading: notesLoading } = useMeasurementNotes(
    campaignIdNum,
    stationIdNum,
    sensorIdNum,
    point.measurementId,
  );
  const noteQueryKey = [
    'notes',
    'measurement',
    campaignIdNum,
    stationIdNum,
    point.measurementId,
  ];
  const createNote = useCreateMeasurementNote(
    campaignIdNum,
    stationIdNum,
    sensorIdNum,
    point.measurementId,
  );
  const deleteNote = useDeleteNote(noteQueryKey);
  const updateNote = useUpdateNote(noteQueryKey);

  const basePath = `/campaigns/${campaignIdNum}/stations/${stationIdNum}/sensors/${sensorIdNum}/measurements/${point.measurementId}/notes`;

  return (
    <div
      className="absolute bg-white border border-gray-200 rounded-lg shadow-lg text-sm"
      style={{
        left:
          point.x > window.innerWidth / 2 ? point.x - 316 : point.x + 16,
        top: Math.max(Math.min(point.y - 100, window.innerHeight - 420), 0),
        width: '300px',
        maxHeight: '420px',
        overflowY: 'auto',
        pointerEvents: 'auto',
      }}
    >
      <div className="flex items-start justify-between gap-2 p-3 border-b border-gray-100">
        <div>
          <div className="font-semibold text-gray-900">
            {point.timestamp.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            <NumberFormatter value={point.value} /> {point.bucketContext && (
              <span>
                · bucket average <NumberFormatter value={point.bucketContext.averageValue} />
                {' '}(n={point.bucketContext.pointCount})
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {hasValidGeometry(point) && (
        <div className="h-32 w-full border-b border-gray-100">
          <GeometryMap
            geoJSON={point.geometry as GeoJSON.Geometry}
            markers={(notesData?.items ?? [])
              .filter((note) => note.location)
              .map((note) => ({
                position: note.location as GeoJSON.Point,
                color: '#ea580c',
                label: note.content,
              }))}
          />
        </div>
      )}

      <div className="p-1">
        <NotesList
          notes={notesData?.items ?? []}
          isLoading={notesLoading}
          currentUsername={username ?? undefined}
          canWrite={Boolean(username)}
          enableLocationPicker
          baseGeometry={point.geometry}
          onAdd={(content, location) => createNote.mutate({ content, location })}
          onDelete={(noteId) =>
            deleteNote.mutate({ noteId, deletePath: `${basePath}/${noteId}` })
          }
          onUpdate={(noteId, content, location) =>
            updateNote.mutate({ updatePath: `${basePath}/${noteId}`, content, location })
          }
          isAdding={createNote.isPending}
          isDeleting={deleteNote.isPending}
          isUpdating={updateNote.isPending}
        />
      </div>
    </div>
  );
};

export default MeasurementNoteCallout;
