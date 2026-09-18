import React from 'react';
import type { MeasurementNote } from '../../../hooks/notes/types';
import { AddNoteForm } from '../../common/Notes/AddNoteForm';
import { formatTimeInZone } from '../../../utils/timezones';
import type { SelectedPointPayload } from './MeasurementNoteCallout';

interface MeasurementNotesPanelProps {
  notes: MeasurementNote[];
  isLoading: boolean;
  isError: boolean;
  stationTimezone: string;
  selectedPoint: SelectedPointPayload | null;
  canWrite: boolean;
  isAdding: boolean;
  onAdd: (content: string, location?: GeoJSON.Point | null) => void;
  onClose: () => void;
}

const MeasurementNotesPanel: React.FC<MeasurementNotesPanelProps> = ({
  notes,
  isLoading,
  isError,
  stationTimezone,
  selectedPoint,
  canWrite,
  isAdding,
  onAdd,
  onClose,
}) => {
  const sortedNotes = React.useMemo(
    () => [...notes].sort(
      (a, b) => new Date(b.measurement_timestamp).getTime() - new Date(a.measurement_timestamp).getTime(),
    ),
    [notes],
  );

  return (
    <aside
      aria-label="Chart point notes"
      className="w-full shrink-0 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm xl:w-80"
      style={{ maxHeight: 500 }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Chart point notes{notes.length > 0 ? ` (${notes.length})` : ''}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Notes are attached to individual measurements.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Hide chart point notes"
        >
          Hide
        </button>
      </div>

      <section className="p-4" aria-labelledby="measurement-notes-list-heading">
        <h3 id="measurement-notes-list-heading" className="text-sm font-semibold text-gray-800">
          Notes by measurement time
        </h3>
        {isLoading ? (
          <p className="mt-3 text-sm text-gray-500">Loading notes…</p>
        ) : isError ? (
          <p className="mt-3 text-sm text-red-600">
            We couldn’t load chart point notes. Try reloading the chart.
          </p>
        ) : sortedNotes.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">No chart point notes yet.</p>
        ) : (
          <ol className="mt-3 space-y-3">
            {sortedNotes.map((note) => {
              const timestamp = new Date(note.measurement_timestamp);
              return (
                <li key={note.id} className="rounded border border-gray-200 bg-gray-50 p-3">
                  <time
                    dateTime={timestamp.toISOString()}
                    className="text-xs font-medium text-gray-600"
                  >
                    {formatTimeInZone(timestamp, stationTimezone || 'UTC')}
                  </time>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{note.content}</p>
                  <p className="mt-1 text-xs text-gray-400">{note.created_by}</p>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="border-t border-gray-200 p-4" aria-labelledby="add-measurement-note-heading">
        <h3 id="add-measurement-note-heading" className="text-sm font-semibold text-gray-800">
          Add a note
        </h3>
        {!canWrite ? (
          <p className="mt-2 text-sm text-gray-500">You do not have permission to add notes.</p>
        ) : !selectedPoint || selectedPoint.measurementId <= 0 ? (
          <p className="mt-2 text-sm text-gray-500">
            Select a point on the chart to attach a note to that measurement.
          </p>
        ) : (
          <>
            <p className="mt-2 text-xs text-gray-600">
              Selected measurement:{' '}
              <span className="font-medium">
                {formatTimeInZone(selectedPoint.timestamp, stationTimezone || 'UTC')}
              </span>
            </p>
            <AddNoteForm
              onSubmit={onAdd}
              isLoading={isAdding}
              enableLocationPicker
              baseGeometry={selectedPoint.geometry}
            />
          </>
        )}
      </section>
    </aside>
  );
};

export default MeasurementNotesPanel;
