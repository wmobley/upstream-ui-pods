import { useState } from 'react';
import GeometryMap from '../GeometryMap/GeometryMap';

interface LocationPickerFieldProps {
  value: GeoJSON.Point | null;
  onChange: (point: GeoJSON.Point | null) => void;
  /** The measurement's own location, used only to center/seed the picker map
   * when no location has been picked yet. */
  baseGeometry?: GeoJSON.Point | null;
  disabled?: boolean;
}

export function LocationPickerField({
  value,
  onChange,
  baseGeometry,
  disabled,
}: LocationPickerFieldProps) {
  const [expanded, setExpanded] = useState(false);
  const mapBase = value ?? baseGeometry ?? null;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          disabled={disabled}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {expanded ? 'Hide map' : value ? 'Edit location' : 'Add location'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={disabled}
            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            Clear location
          </button>
        )}
      </div>

      {expanded && (
        mapBase ? (
          <div className="h-32 w-full overflow-hidden rounded border border-gray-200">
            <GeometryMap
              geoJSON={mapBase}
              markers={value ? [{ position: value, color: '#ea580c', label: 'Note location' }] : undefined}
              onPick={disabled ? undefined : onChange}
            />
          </div>
        ) : (
          <p className="text-xs text-gray-400">No base location available to center the map.</p>
        )
      )}
    </div>
  );
}
