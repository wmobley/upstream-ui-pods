import { useState } from 'react';
import { useList as useListDownsampled } from '../../../hooks/measurements/useList';
import QueryWrapper from '../../common/QueryWrapper';
import { DataPoint } from '../../../utils/dataProcessing';
import { formatNumber } from '../../common/NumberFormatter/NumberFortatterUtils';
import TimeSeriesChart from '../../ScatterTimeSeriesChart';

interface TimeSeriesGraphProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}
const Chart = ({ campaignId, stationId, sensorId }: TimeSeriesGraphProps) => {
  const [minValueInput, setMinValueInput] = useState<string>('');
  const [maxValueInput, setMaxValueInput] = useState<string>('');
  const minMeasurementValue =
    minValueInput.trim() === '' ? undefined : Number(minValueInput);
  const maxMeasurementValue =
    maxValueInput.trim() === '' ? undefined : Number(maxValueInput);

  const { data, isLoading, error } = useListDownsampled(
    campaignId,
    stationId,
    sensorId,
    500000,
    100,
    Number.isFinite(minMeasurementValue) ? minMeasurementValue : undefined,
    Number.isFinite(maxMeasurementValue) ? maxMeasurementValue : undefined,
  );
  const downsampledData = data?.items.map(
    (item) =>
      ({
        timestamp: item.collectiontime,
        value: item.value,
        geometry: item.geometry,
      }) as DataPoint,
  );

  // Add state for selected time range
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [number, number] | null
  >(null);

  if (!downsampledData || isLoading || error) {
    return (
      <QueryWrapper isLoading={isLoading} error={error}>
        <></>
      </QueryWrapper>
    );
  }
  if (downsampledData && downsampledData.length === 0) {
    return <div>No data</div>;
  }

  return (
    <QueryWrapper isLoading={isLoading || !downsampledData} error={error}>
      <div className="p-4 w-full h-full flex flex-col">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span>Value &gt;=</span>
            <input
              className="w-36 rounded border border-gray-300 px-3 py-2"
              inputMode="decimal"
              type="number"
              value={minValueInput}
              onChange={(event) => setMinValueInput(event.target.value)}
              placeholder="No minimum"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span>Value &lt;=</span>
            <input
              className="w-36 rounded border border-gray-300 px-3 py-2"
              inputMode="decimal"
              type="number"
              value={maxValueInput}
              onChange={(event) => setMaxValueInput(event.target.value)}
              placeholder="No maximum"
            />
          </label>
        </div>
        <TimeSeriesChart
          campaignId={campaignId}
          stationId={stationId}
          sensorId={sensorId}
          data={downsampledData}
          minMeasurementValue={
            Number.isFinite(minMeasurementValue) ? minMeasurementValue : undefined
          }
          maxMeasurementValue={
            Number.isFinite(maxMeasurementValue) ? maxMeasurementValue : undefined
          }
          margin={{ top: 10, right: 100, bottom: 100, left: 100 }}
          showArea={false}
          showLine={false}
          showPoints={true}
          colors={{
            line: '#9a6fb0',
            area: '#9a6fb0',
            point: '#9a6fb0',
          }}
          xAxisTitle="Date"
          yAxisTitle="Value"
          xFormatter={(date: Date | number) => {
            const dateObj = date instanceof Date ? date : new Date(date);
            // For main chart - show time
            if (selectedTimeRange) {
              return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
            }
            // For overview - show date
            return dateObj.toLocaleDateString();
          }}
          xFormatterOverview={(date: Date | number) => {
            const dateObj = date instanceof Date ? date : new Date(date);
            return dateObj.toLocaleDateString();
          }}
          yFormatter={(value: number) => formatNumber(value)}
          onBrush={(domain) => {
            setSelectedTimeRange(domain);
            console.log(
              'Selected time range:',
              new Date(domain[0]),
              'to',
              new Date(domain[1]),
            );
          }}
        />
      </div>
    </QueryWrapper>
  );
};

export default Chart;
