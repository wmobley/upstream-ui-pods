import React from 'react';
import NumberFormatter from '../NumberFormatter/NumberFormatter';

interface SensorTooltipProps {
  value: number;
  timestamp?: Date;
  units?: string;
  className?: string;
  showTimestamp?: boolean;
  precision?: number;
}

const SensorTooltip: React.FC<SensorTooltipProps> = ({
  value,
  timestamp,
  units,
  className = '',
  showTimestamp = true,
  precision = 3,
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {showTimestamp && timestamp && (
        <div className="text-sm text-gray-600">
          {timestamp.toLocaleString()}
        </div>
      )}
      <div className="flex items-center gap-1">
        <span className="font-medium">Value:</span>
        <NumberFormatter
          value={value}
          precision={precision}
          className="font-mono"
          scientificNotationThreshold={{
            min: 0.01,
            max: 10000,
          }}
        />
        {units && <span className="text-sm text-gray-600 ml-1">{units}</span>}
      </div>
    </div>
  );
};

export default SensorTooltip;
