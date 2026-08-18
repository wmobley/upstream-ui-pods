import tzLookup from 'tz-lookup';
import { GetCampaignResponse } from '@upstream/upstream-api';

export const TIMEZONES: string[] = (() => {
  const supportedValuesOf = (
    Intl as unknown as { supportedValuesOf?: (key: string) => string[] }
  ).supportedValuesOf;
  let zones: string[] = [];
  if (typeof supportedValuesOf === 'function') {
    try {
      zones = supportedValuesOf('timeZone');
    } catch {
      // Fall through to the fallback list below.
    }
  }
  if (!zones.length) {
    // Older browsers without Intl.supportedValuesOf fall back to common zones.
    zones = [
      'UTC',
      'America/Anchorage',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/New_York',
      'America/Phoenix',
      'Pacific/Honolulu',
    ];
  }
  // Intl.supportedValuesOf('timeZone') does NOT include 'UTC', yet it is the
  // default/fallback value the app assigns to stations. Without this entry a
  // <select value="UTC"> matches no option and renders the first zone instead
  // (e.g. Africa/Abidjan). Keep UTC first so it is easy to find.
  if (!zones.includes('UTC')) {
    zones = ['UTC', ...zones];
  }
  return zones;
})();

type BboxLike = {
  bboxWest?: number | null;
  bboxEast?: number | null;
  bboxSouth?: number | null;
  bboxNorth?: number | null;
};

/** Read a bbox field accepting both camelCase (generated client type) and
 * snake_case (raw API response, which useDetail does not transform). */
function bboxField(
  location: BboxLike,
  camel: keyof BboxLike,
  snake: string,
): number | null | undefined {
  const camelValue = location[camel];
  if (camelValue != null) {
    return camelValue;
  }
  return (location as unknown as Record<string, number | null | undefined>)[snake] ?? null;
}

export function suggestedTimezoneFor(campaign: GetCampaignResponse): string | undefined {
  const location = campaign.location;
  if (!location) {
    return undefined;
  }
  const west = bboxField(location, 'bboxWest', 'bbox_west');
  const east = bboxField(location, 'bboxEast', 'bbox_east');
  const south = bboxField(location, 'bboxSouth', 'bbox_south');
  const north = bboxField(location, 'bboxNorth', 'bbox_north');
  if (west == null || east == null || south == null || north == null) {
    return undefined;
  }
  const lat = (south + north) / 2;
  const lon = (west + east) / 2;
  try {
    return tzLookup(lat, lon) as string;
  } catch {
    return undefined;
  }
}

/** Full date + time of an instant in a specific IANA timezone
 * (e.g. 'America/Chicago'). Measurements are stored as UTC instants, so
 * charts render them in the station's timezone with this helper. */
export function formatTimeInZone(date: Date | number, timeZone: string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(dateObj);
}

/** Date-only part of an instant in a specific timezone. */
export function formatDateInZone(date: Date | number, timeZone: string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(dateObj);
}

/** Time-only part of an instant in a specific timezone. */
export function formatTimeOnlyInZone(date: Date | number, timeZone: string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(dateObj);
}