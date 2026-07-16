import React from 'react';
import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';
import NumberFormatter from '../../common/NumberFormatter/NumberFormatter';
import GeometryMap from '../../common/GeometryMap/GeometryMap';

// Types
export interface TooltipData {
  x: number;
  y: number;
  data: AggregatedMeasurement;
  sensorId: string;
}

export interface PointTooltipData extends Partial<MeasurementItem> {
  x: number;
  y: number;
}

interface ChartTooltipProps {
  tooltip: TooltipData | null;
  tooltipPoint: PointTooltipData | null;
  setTooltipAggregation: React.Dispatch<
    React.SetStateAction<TooltipData | null>
  >;
  setTooltipPoint: React.Dispatch<
    React.SetStateAction<PointTooltipData | null>
  >;
  renderDataPoints: boolean;
  onSelectMeasurementForNote?: (measurementId: number) => void;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({
  tooltip,
  tooltipPoint,
  setTooltipAggregation,
  setTooltipPoint,
  renderDataPoints,
  onSelectMeasurementForNote,
}) => {
  return (
    <>
      {tooltip && (
        <div
          className="absolute bg-white border border-gray-300 rounded shadow-lg p-2 text-sm"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 100,
            pointerEvents: 'auto',
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium">Aggregated Point Details</div>
            <button
              onClick={() => setTooltipAggregation(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
              aria-label="Close tooltip"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div>Time: {tooltip.data.measurementTime.toLocaleString()}</div>
          <div>
            Value: <NumberFormatter value={tooltip.data.value} />
          </div>
          <div>
            Median: <NumberFormatter value={tooltip.data.medianValue} />
          </div>
          <div>
            Confidence Interval: [
            <NumberFormatter value={tooltip.data.parametricLowerBound} />,
            <NumberFormatter value={tooltip.data.parametricUpperBound} /> ]
          </div>
          <div>Point Count: {tooltip.data.pointCount}</div>
          <div>Sensor ID: {tooltip.sensorId}</div>
        </div>
      )}

      {tooltipPoint && renderDataPoints && (
        <div
          className="absolute bg-white border border-gray-300 rounded shadow-lg p-2 text-sm"
          style={{
            left:
              tooltipPoint.x > window.innerWidth / 2
                ? tooltipPoint.x - 310
                : tooltipPoint.x + 10,
            top: Math.min(tooltipPoint.y - 100, window.innerHeight - 310),
            width: '300px',
            height: '300px',
            pointerEvents: 'auto',
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium">Individual Point Details</div>
            <button
              onClick={() => setTooltipPoint(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
              aria-label="Close tooltip"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div>Time: {tooltipPoint.collectiontime?.toLocaleString()}</div>
          <div>
            Value: <NumberFormatter value={tooltipPoint.value ?? 0} />
          </div>
          <div>Alias: {tooltipPoint.variablename}</div>
          <div>
            <div className="h-48 w-full">
              <GeometryMap
                geoJSON={tooltipPoint.geometry as GeoJSON.Geometry}
              />
            </div>
          </div>
          {tooltipPoint.id !== undefined && onSelectMeasurementForNote && (
            <button
              onClick={() => {
                onSelectMeasurementForNote(tooltipPoint.id!);
                setTooltipPoint(null);
              }}
              className="mt-2 w-full rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
            >
              View / Add Note
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ChartTooltip;
