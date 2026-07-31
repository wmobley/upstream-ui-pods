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
  /** Only ever populated for measurement-scope notes — see
   * docs/design/2026-07-23-measurement-note-location.md. Independent of the
   * measurement's own location (e.g. a plume traced back to a different spot). */
  location?: GeoJSON.Point | null;
}

export function pointToWkt(point: GeoJSON.Point): string {
  const [lng, lat] = point.coordinates;
  return `POINT(${lng} ${lat})`;
}

export interface ListNotesResponse {
  items: Note[];
  total: number;
}
