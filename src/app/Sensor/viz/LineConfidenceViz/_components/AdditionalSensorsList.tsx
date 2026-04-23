import React from 'react';
import { useLineConfidence } from '../context/LineConfidenceContextState';

interface AdditionalSensorsListProps {
  color?: string;
}

export const AdditionalSensorsList: React.FC<AdditionalSensorsListProps> = ({
  color,
}) => {
  const { additionalSensors, removeSensor } = useLineConfidence();

  if (additionalSensors.length === 0) {
    return null;
  }

  return (
    <div className={`mt-4`}>
      <h3 className="text-lg font-medium mb-2">Comparison Sensors</h3>
      <ul className="space-y-2">
        {additionalSensors.map((sensor) => (
          <li
            key={sensor.info.key}
            className="flex justify-between items-center p-3 border rounded bg-gray-50"
          >
            <div>
              <span className="font-medium">
                {sensor.info.label || `Sensor ${sensor.info.id}`}
              </span>
              {sensor.info.stationName && (
                <span className="ml-2 text-sm text-gray-600">
                  {sensor.info.stationName}
                </span>
              )}
              {color && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
            </div>
            <button
              onClick={() => removeSensor(sensor.info.key)}
              className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
              aria-label={`Remove ${sensor.info.label || `sensor ${sensor.info.id}`}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
