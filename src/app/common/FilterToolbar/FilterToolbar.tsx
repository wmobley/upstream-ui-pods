import React, { useState } from 'react';
import { LatLngBounds } from 'leaflet';
import FilteringMapButton from '../../Home/_components/CampaignFilterToolbar/_components/FilteringMapButton/FilteringMapButton';

// Define filter types
export type FilterType = 'date' | 'map' | 'variable' | 'custom';

// Define filter configuration interface with generics
export interface FilterConfig<T = unknown> {
  type: FilterType;
  id: string;
  label?: string;
  value?: T;
  onChange?: (value: T) => void;
  component?: React.ReactNode;
}

// Type-specific filter configs
export type DateFilterConfig = FilterConfig<Date>;
export type MapFilterConfig = FilterConfig<LatLngBounds | null>;
export type VariableFilterConfig = FilterConfig<string[]>;
export type CustomFilterConfig = FilterConfig<unknown>;

// Union type for all filter configs
export type AnyFilterConfig =
  | DateFilterConfig
  | MapFilterConfig
  | VariableFilterConfig
  | CustomFilterConfig;

interface FilterToolbarProps {
  title?: string;
  filters?: AnyFilterConfig[];
  children?: React.ReactNode;
}

const FilterToolbar: React.FC<FilterToolbarProps> = ({
  title = 'Filters',
  filters = [],
  children,
}) => {
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  const handleStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange?: (date: Date) => void,
  ) => {
    const newStartDate = e.target.value;
    onChange?.(new Date(newStartDate));
  };

  const handleBoundingBoxSelect = (
    bounds: LatLngBounds | null,
    onChange?: (bounds: LatLngBounds | null) => void,
  ) => {
    setBounds(bounds);
    onChange?.(bounds);
  };

  const renderFilter = (filter: AnyFilterConfig) => {
    let dateFilter: DateFilterConfig | undefined;
    let mapFilter: MapFilterConfig | undefined;

    if (filter.type === 'date') {
      dateFilter = filter as DateFilterConfig;
    } else if (filter.type === 'map') {
      mapFilter = filter as MapFilterConfig;
    }

    switch (filter.type) {
      case 'date':
        return (
          <div key={filter.id} className="flex flex-col gap-1">
            <label htmlFor={filter.id} className="text-sm text-gray-600">
              {filter.label || 'Date'}
            </label>
            <input
              id={filter.id}
              type="date"
              className="p-2 border border-gray-300 rounded-md"
              value={
                dateFilter?.value instanceof Date
                  ? dateFilter.value.toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => handleStartDateChange(e, dateFilter?.onChange)}
            />
          </div>
        );
      case 'map':
        return (
          <FilteringMapButton
            key={filter.id}
            onBoundingBoxSelect={(bounds) =>
              handleBoundingBoxSelect(bounds, mapFilter?.onChange)
            }
            bounds={bounds}
          />
        );
      case 'custom':
        return filter.component;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <div className="flex gap-4 flex-wrap">
        {filters.map(f => <span key={f.id}>{renderFilter(f)}</span> )}
        {children}
      </div>
    </div>
  );
};

export default FilterToolbar;
