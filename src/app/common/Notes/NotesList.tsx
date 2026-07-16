import { useState } from 'react';
import type { Note } from '../../../hooks/notes/types';
import { AddNoteForm } from './AddNoteForm';

interface NotesListProps {
  notes: Note[];
  isLoading: boolean;
  currentUsername?: string;
  onAdd: (content: string) => void;
  onDelete: (noteId: number) => void;
  isAdding: boolean;
  isDeleting: boolean;
  canWrite: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function NotesList({
  notes,
  isLoading,
  currentUsername,
  onAdd,
  onDelete,
  isAdding,
  isDeleting,
  canWrite,
}: NotesListProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded border border-gray-200 bg-white">
      <button
        className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Notes {notes.length > 0 ? `(${notes.length})` : ''}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-gray-200 px-4 pb-4 pt-2">
          {isLoading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-gray-400">No notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note.id} className="rounded bg-gray-50 p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="whitespace-pre-wrap text-gray-800">{note.content}</p>
                    {currentUsername === note.created_by && (
                      <button
                        onClick={() => onDelete(note.id)}
                        disabled={isDeleting}
                        className="shrink-0 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {note.created_by} · {formatDate(note.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {canWrite && (
            <AddNoteForm onSubmit={onAdd} isLoading={isAdding} />
          )}
        </div>
      )}
    </div>
  );
}
