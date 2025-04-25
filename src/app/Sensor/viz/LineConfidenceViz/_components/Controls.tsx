import { AGGREGATION_INTERVALS } from '../context/LineConfidenceContext';
import { useLineConfidence } from '../context/LineConfidenceContext';
import { Link } from 'react-router-dom';
import { AddSensorButton } from './AddSensorButton';
import { useState } from 'react';
import { MeasurementItem } from '@upstream/upstream-api';

interface ControlsProps {
  campaignId: string;
  stationId: string;
}

const Controls = ({ campaignId, stationId }: ControlsProps) => {
  const {
    aggregationInterval,
    handleAggregationIntervalChange,
    renderDataPoints,
    setRenderDataPoints,
    selectedTimeRange,
    aggregatedData,
    allPoints,
    additionalSensors,
  } = useLineConfidence();

  // State for active button styling
  const [activeExport, setActiveExport] = useState<string | null>(null);
  // State to track which dataset to export
  const [exportDataset, setExportDataset] = useState<'aggregated' | 'all'>(
    'aggregated',
  );

  // Handle data export
  const handleExport = (format: string) => {
    setActiveExport(format);

    let dataToExport;

    if (exportDataset === 'aggregated') {
      dataToExport = aggregatedData;
    } else if (exportDataset === 'all') {
      dataToExport = allPoints;
    }

    if (!dataToExport) return;

    let content = '';
    let filename = `sensor-data-${exportDataset}-${new Date().toISOString()}`;
    let mimeType = '';

    if (format === 'csv') {
      // Create CSV content with appropriate headers based on dataset
      let headers: string[] = [];

      if (exportDataset === 'aggregated') {
        headers = [
          'measurementTime',
          'value',
          'minValue',
          'maxValue',
          'parametricLowerBound',
          'parametricUpperBound',
        ];
      } else if (exportDataset === 'all') {
        // Headers for all points measurements
        headers = [
          'sensorId',
          'id',
          'value',
          'collectiontime',
          'sensorid',
          'variablename',
          'variabletype',
          'description',
        ];
      }

      content = headers.join(',') + '\n';

      if (exportDataset === 'aggregated' && aggregatedData) {
        aggregatedData.forEach((measurement) => {
          const rowData = [
            new Date(measurement.measurementTime).toISOString(),
            measurement.value,
            measurement.minValue,
            measurement.maxValue,
            measurement.parametricLowerBound,
            measurement.parametricUpperBound,
          ];
          content += rowData.join(',') + '\n';
        });
      } else if (exportDataset === 'all' && allPoints) {
        // Handle the items array in ListMeasurementsResponsePagination
        allPoints.items.forEach((item: MeasurementItem) => {
          const rowData = [
            item.sensorid || '',
            item.id,
            item.value,
            new Date(item.collectiontime).toISOString(),
            item.sensorid || '',
            item.variablename || '',
            item.variabletype || '',
            item.description || '',
          ];
          content += rowData.join(',') + '\n';
        });

        // Add data from additional sensors
        if (additionalSensors && additionalSensors.length > 0) {
          additionalSensors.forEach((sensor) => {
            if (sensor.allPoints && sensor.allPoints.items) {
              sensor.allPoints.items.forEach((item: MeasurementItem) => {
                const rowData = [
                  sensor.info.id, // Additional sensor ID
                  item.id,
                  item.value,
                  new Date(item.collectiontime).toISOString(),
                  item.sensorid || '',
                  item.variablename || '',
                  item.variabletype || '',
                  item.description || '',
                ];
                content += rowData.join(',') + '\n';
              });
            }
          });
        }
      }

      filename += '.csv';
      mimeType = 'text/csv';
    } else if (format === 'json') {
      // Create JSON content
      if (exportDataset === 'aggregated' && aggregatedData) {
        content = JSON.stringify(aggregatedData, null, 2);
      } else if (exportDataset === 'all' && allPoints) {
        // Create a structured representation of all points including additional sensors
        const allData = [
          {
            sensorId: campaignId + '-' + stationId,
            points: allPoints.items,
          },
        ];

        // Add additional sensors data
        if (additionalSensors && additionalSensors.length > 0) {
          additionalSensors.forEach((sensor) => {
            if (sensor.allPoints && sensor.allPoints.items) {
              allData.push({
                sensorId: sensor.info.id,
                points: sensor.allPoints.items,
              });
            }
          });
        }

        content = JSON.stringify(allData, null, 2);
      }
      filename += '.json';
      mimeType = 'application/json';
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);

    // Reset active state after a delay
    setTimeout(() => setActiveExport(null), 1000);
  };

  return (
    <div className="border-b pb-4">
      <div className="flex flex-col flex-wrap items-center justify-between gap-4">
        {/* Time Controls Group */}
        <div className="flex items-center gap-4 p-2 bg-gray-50 rounded border w-full">
          <div className="flex items-center">
            <label
              htmlFor="aggregationInterval"
              className="mr-2 text-sm font-medium"
            >
              Aggregation Interval:
            </label>
            <select
              id="aggregationInterval"
              value={aggregationInterval || ''}
              onChange={handleAggregationIntervalChange}
              className="p-2 border rounded text-sm"
            >
              {AGGREGATION_INTERVALS.map((interval) => (
                <option key={interval} value={interval}>
                  {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="h-8 border-r border-gray-300"></div>

          <div className="text-sm">
            {selectedTimeRange ? (
              <span>
                Viewing: {new Date(selectedTimeRange[0]).toLocaleString()} -{' '}
                {new Date(selectedTimeRange[1]).toLocaleString()}
              </span>
            ) : (
              <span>Viewing all data</span>
            )}
          </div>
        </div>

        <div className="flex flex-row justify-between gap-4 w-full">
          {/* Visualization Controls Group */}
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded border">
            <AddSensorButton campaignId={campaignId} stationId={stationId} />
            <button
              onClick={() => setRenderDataPoints(!renderDataPoints)}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                renderDataPoints
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-primary-600 border border-primary-600'
              }`}
              aria-label={
                renderDataPoints ? 'Hide Data Points' : 'Show Data Points'
              }
              title={renderDataPoints ? 'Hide Data Points' : 'Show Data Points'}
            >
              {renderDataPoints ? 'Hide Data Points' : 'Show Data Points'}
            </button>

            <Link
              to={`/docs/confidence-explanation`}
              className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              About Confidence Intervals
            </Link>
          </div>

          {/* Export Controls Group */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
            <span className="text-sm font-medium">Export:</span>

            {/* Dataset selection */}
            <div className="flex items-center mr-3">
              <label className="inline-flex items-center mr-3">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-primary-600"
                  checked={exportDataset === 'aggregated'}
                  onChange={() => setExportDataset('aggregated')}
                />
                <span className="ml-1 text-sm">Aggregated</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-primary-600"
                  checked={exportDataset === 'all'}
                  onChange={() => setExportDataset('all')}
                />
                <span className="ml-1 text-sm">All Points</span>
              </label>
            </div>

            <button
              onClick={() => handleExport('csv')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                activeExport === 'csv'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-primary-600 border border-primary-600 hover:bg-gray-50'
              }`}
              disabled={
                exportDataset === 'aggregated' ? !aggregatedData : !allPoints
              }
              title="Export as CSV"
            >
              CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                activeExport === 'json'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-primary-600 border border-primary-600 hover:bg-gray-50'
              }`}
              disabled={
                exportDataset === 'aggregated' ? !aggregatedData : !allPoints
              }
              title="Export as JSON"
            >
              JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
