import React, { useState } from 'react';
import { LatLngBounds } from 'leaflet';
import FilteringMapButton from '../../Home/_components/CampaignFilterToolbar/_components/FilteringMapButton/FilteringMapButton';

interface FilterToolbarProps {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: (date: Date) => void;
  onEndDateChange?: (date: Date) => void;
  onBoundsChange?: (bounds: LatLngBounds | null) => void;
  showDateFilters?: boolean;
  showMapFilter?: boolean;
  showVariableFilter?: boolean;
  children?: React.ReactNode;
}

const FilterToolbar: React.FC<FilterToolbarProps> = ({
  title = 'Filters',
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onBoundsChange,
  showDateFilters = true,
  showMapFilter = true,
  showVariableFilter = true,
  children,
}) => {
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    onStartDateChange?.(new Date(newStartDate));

    // If end date becomes invalid with new start date, update it
    if (
      endDate &&
      onEndDateChange &&
      new Date(endDate) < new Date(newStartDate)
    ) {
      onEndDateChange(new Date(newStartDate));
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    // Only allow end date changes if it's after or equal to start date
    if (!startDate || new Date(newEndDate) >= new Date(startDate)) {
      onEndDateChange?.(new Date(newEndDate));
    }
  };

  const handleBoundingBoxSelect = (bounds: LatLngBounds | null) => {
    setBounds(bounds);
    onBoundsChange?.(bounds);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <div className="flex gap-4 flex-wrap">
        {showDateFilters && (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="start-date" className="text-sm text-gray-600">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                className="p-2 border border-gray-300 rounded-md"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={handleStartDateChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="end-date" className="text-sm text-gray-600">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                className="p-2 border border-gray-300 rounded-md"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={handleEndDateChange}
              />
            </div>
          </>
        )}

        {showMapFilter && (
          <FilteringMapButton
            onBoundingBoxSelect={handleBoundingBoxSelect}
            bounds={bounds}
          />
        )}

        {showVariableFilter && children}
      </div>
    </div>
  );
};

export default FilterToolbar;
