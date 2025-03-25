import React, { useEffect, useState } from 'react';
import FilteringMapButton from '../FilteringMapButton/FilteringMapButton';
import { LatLngBounds } from 'leaflet';

interface CampaignFilterToolbarProps {
  selectedArea: string;
  selectedInstrument: string;
  startDate: string;
  endDate: string;
  onAreaChange: (area: string) => void;
  onInstrumentChange: (instrument: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const CampaignFilterToolbar: React.FC<CampaignFilterToolbarProps> = ({
  selectedArea,
  selectedInstrument,
  startDate,
  endDate,
  onAreaChange,
  onInstrumentChange,
  onStartDateChange,
  onEndDateChange,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [dateError, setDateError] = useState<string>('');

  // Validate dates whenever they change
  useEffect(() => {
    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        setDateError('End date cannot be before start date');
      } else {
        setDateError('');
      }
    }
  }, [startDate, endDate]);

  const handleBoundingBoxSelect = (bounds: LatLngBounds) => {
    console.log(bounds);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    if (endDate && new Date(endDate) < new Date(newStartDate)) {
      onEndDateChange(newStartDate); // Auto-adjust end date if it becomes invalid
    }
    onStartDateChange(newStartDate);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        {/* <select
          className="p-2 border rounded-md"
          value={selectedArea}
          onChange={(e) => onAreaChange(e.target.value)}
        >
          <option value="">All Areas</option>
          {MOCK_AREAS.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select> */}

        {/* <select
          className="p-2 border rounded-md"
          value={selectedInstrument}
          onChange={(e) => onInstrumentChange(e.target.value)}
        >
          <option value="">All Instruments</option>
          {MOCK_INSTRUMENTS.map((instrument) => (
            <option key={instrument.id} value={instrument.id}>
              {instrument.name}
            </option>
          ))}
        </select> */}

        <div className="flex flex-col gap-1">
          <label htmlFor="start-date" className="text-sm text-gray-600">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            className={`p-2 border rounded-md ${
              dateError ? 'border-red-500' : 'border-gray-300'
            }`}
            value={startDate}
            onChange={handleStartDateChange}
            max={today}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="end-date" className="text-sm text-gray-600">
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            className={`p-2 border rounded-md ${
              dateError ? 'border-red-500' : 'border-gray-300'
            }`}
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate}
            max={today}
          />
        </div>

        <FilteringMapButton onBoundingBoxSelect={handleBoundingBoxSelect} />
      </div>

      {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
    </div>
  );
};

export default CampaignFilterToolbar;
