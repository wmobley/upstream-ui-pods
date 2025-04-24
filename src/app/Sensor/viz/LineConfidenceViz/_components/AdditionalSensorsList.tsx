import React from 'react';
import { useLineConfidence } from '../context/LineConfidenceContext';

interface AdditionalSensorsListProps {
  className?: string;
}

export const AdditionalSensorsList: React.FC<AdditionalSensorsListProps> = ({
  className,
}) => {
  const { additionalSensors, removeSensor } = useLineConfidence();

  if (additionalSensors.length === 0) {
    return null;
  }

  return (
    <div className={`mt-4 ${className}`}>
      <h3 className="text-lg font-medium mb-2">Comparison Sensors</h3>
      <ul className="space-y-2">
        {additionalSensors.map((sensor) => (
          <li
            key={sensor.info.id}
            className="flex justify-between items-center p-3 border rounded bg-gray-50"
          >
            <div>
              <span className="font-medium">Sensor {sensor.info.id}</span>
              <div className="text-sm text-gray-500">
                {sensor.aggregatedData?.[0].measurementTime.toLocaleString()} to
                {sensor.aggregatedData?.[
                  sensor.aggregatedData.length - 1
                ].measurementTime.toLocaleString()}
              </div>
              <div className="text-xs mt-1">
                {sensor.aggregatedLoading
                  ? 'Loading data...'
                  : sensor.aggregatedError
                    ? `Error: ${sensor.aggregatedError.message}`
                    : `${sensor.aggregatedData?.length || 0} aggregated points loaded`}
              </div>
            </div>
            <button
              onClick={() => removeSensor(sensor.info.id)}
              className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
              aria-label={`Remove sensor ${sensor.info.id}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
