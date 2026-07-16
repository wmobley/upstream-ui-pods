import { useState } from 'react';
import type { Note } from '../../../hooks/notes/types';
import { AddNoteForm } from './AddNoteForm';

interface NotesListProps {
  notes: Note[];
  isLoading: boolean;
  currentUsername?: string;
  onAdd: (content: string) => void;
  onDelete: (noteId: number) => void;
  onUpdate: (noteId: number, content: string) => void;
  isAdding: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
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
  onUpdate,
  isAdding,
  isDeleting,
  isUpdating,
  canWrite,
}: NotesListProps) {
  const [open, setOpen] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditContent(note.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditContent('');
  }

  function saveEdit(noteId: number) {
    if (!editContent.trim()) return;
    onUpdate(noteId, editContent.trim());
    setEditingId(null);
    setEditContent('');
  }

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
                  {editingId === note.id ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full rounded border border-gray-300 p-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        rows={3}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(note.id)}
                          disabled={isUpdating || !editContent.trim()}
                          className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <p className="whitespace-pre-wrap text-gray-800">{note.content}</p>
                      {currentUsername === note.created_by && (
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => startEdit(note)}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(note.id)}
                            disabled={isDeleting}
                            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
