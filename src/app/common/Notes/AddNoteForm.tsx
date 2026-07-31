import { useState } from 'react';
import { LocationPickerField } from './LocationPickerField';

interface AddNoteFormProps {
  onSubmit: (content: string, location?: GeoJSON.Point | null) => void;
  isLoading: boolean;
  /** Measurement notes only — see docs/design/2026-07-23-measurement-note-location.md. */
  enableLocationPicker?: boolean;
  baseGeometry?: GeoJSON.Point | null;
}

export function AddNoteForm({
  onSubmit,
  isLoading,
  enableLocationPicker,
  baseGeometry,
}: AddNoteFormProps) {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState<GeoJSON.Point | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    onSubmit(trimmed, enableLocationPicker ? location : undefined);
    setContent('');
    setLocation(null);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
      <textarea
        className="w-full rounded border border-gray-300 p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={3}
        placeholder="Add a note…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />
      {enableLocationPicker && (
        <LocationPickerField
          value={location}
          onChange={setLocation}
          baseGeometry={baseGeometry}
          disabled={isLoading}
        />
      )}
      <button
        type="submit"
        disabled={isLoading || !content.trim()}
        className="self-end rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving…' : 'Add Note'}
      </button>
    </form>
  );
}
