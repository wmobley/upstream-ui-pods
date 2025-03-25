import React from 'react';
import FilteringMapButton from '../FilteringMapButton/FilteringMapButton';
import { LatLngBounds } from 'leaflet';

interface CampaignFilterToolbarProps {
  selectedArea: string;
  selectedInstrument: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  minDate: Date | undefined;
  maxDate: Date | undefined;
}

const CampaignFilterToolbar: React.FC<CampaignFilterToolbarProps> = ({
  selectedArea,
  selectedInstrument,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
}) => {
  const today = new Date();

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    onStartDateChange(newStartDate);

    // If end date becomes invalid with new start date, update it
    if (endDate && new Date(endDate) < new Date(newStartDate)) {
      onEndDateChange(newStartDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    // Only allow end date changes if it's after or equal to start date
    if (!startDate || new Date(newEndDate) >= new Date(startDate)) {
      onEndDateChange(newEndDate);
    }
  };

  const handleBoundingBoxSelect = (bounds: LatLngBounds) => {
    console.log(bounds);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <label htmlFor="start-date" className="text-sm text-gray-600">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            className="p-2 border border-gray-300 rounded-md"
            value={startDate}
            onChange={handleStartDateChange}
            min={minDate?.toISOString().split('T')[0]}
            max={endDate || today.toISOString().split('T')[0]}
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
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate}
            max={
              maxDate
                ? today > maxDate
                  ? today.toISOString().split('T')[0]
                  : maxDate.toISOString().split('T')[0]
                : today.toISOString().split('T')[0]
            }
          />
        </div>

        <FilteringMapButton onBoundingBoxSelect={handleBoundingBoxSelect} />
      </div>
    </div>
  );
};

export default CampaignFilterToolbar;
