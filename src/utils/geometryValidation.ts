/**
 * Geometry validation utilities for campaigns and stations
 */

export interface GeometryEntity {
  geometry?: GeoJSON.Geometry | object | null;
}

/**
 * Validates if an entity (campaign or station) has valid geometry data
 * @param entity - The entity to validate (campaign, station, etc.)
 * @returns boolean indicating if the entity has valid geometry
 */
export function hasValidGeometry<T extends GeometryEntity>(entity?: T | null): entity is T & { geometry: NonNullable<T['geometry']> } {
  return !!(
    entity &&
    entity.geometry &&
    typeof entity.geometry === 'object' &&
    Object.keys(entity.geometry).length > 0
  );
}

/**
 * Type guard for entities with valid geometry
 * @param entity - The entity to check
 * @returns type predicate indicating if entity has valid geometry
 */
export function isEntityWithGeometry<T extends GeometryEntity>(entity: T): entity is T & { geometry: NonNullable<T['geometry']> } {
  return hasValidGeometry(entity);
}