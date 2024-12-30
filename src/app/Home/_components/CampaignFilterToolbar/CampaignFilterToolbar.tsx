import React from 'react';

// Mock data for filters
export const MOCK_AREAS = [
  { id: 'coastal', name: 'Coastal' },
  { id: 'marine', name: 'Marine' },
  { id: 'terrestrial', name: 'Terrestrial' },
  { id: 'atmospheric', name: 'Atmospheric' },
];

export const MOCK_INSTRUMENTS = [
  { id: 'camera', name: 'Camera' },
  { id: 'sensor', name: 'Sensor' },
  { id: 'drone', name: 'Drone' },
  { id: 'satellite', name: 'Satellite' },
];

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
  const today = new Date().toISOString().split('T')[0]; // Gets current date in YYYY-MM-DD format

  return (
    <div className="flex gap-4 flex-wrap">
      <select
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
      </select>

      <select
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
      </select>

      <input
        type="date"
        className="p-2 border rounded-md"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        placeholder="Start Date"
        min="2020-01-01"
        max={today}
      />

      <input
        type="date"
        className="p-2 border rounded-md"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        placeholder="End Date"
        min={startDate || '2020-01-01'}
        max={today}
      />
    </div>
  );
};

export default CampaignFilterToolbar;
