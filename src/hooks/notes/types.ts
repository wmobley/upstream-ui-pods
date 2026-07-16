export type NoteScope = 'campaign' | 'station' | 'sensor' | 'measurement';

export interface Note {
  id: number;
  scope: NoteScope;
  content: string;
  created_by: string;
  created_at: string;
  campaign_id: number;
  station_id: number | null;
  sensor_id: number | null;
  measurement_id: number | null;
}

export interface ListNotesResponse {
  items: Note[];
  total: number;
}
