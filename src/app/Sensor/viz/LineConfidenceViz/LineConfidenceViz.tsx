import { useEffect, useState } from 'react';
import { useDetail } from '../../../../hooks/sensor/useDetail';
import { Chart } from './_components/Chart';
import { selectAggregationInterval } from '../../../../utils/aggregationProcessing';
import QueryWrapper from '../../../common/QueryWrapper';
import MeasurementSummary from '../../../SensorDashboard/_components/MeasurementSummary';
type AggregationInterval =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month';

interface MeasurementsSummaryProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

const AGGREGATION_INTERVALS: AggregationInterval[] = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
];

const LineConfidenceViz = ({
  campaignId,
  stationId,
  sensorId,
}: MeasurementsSummaryProps) => {
  const { data, isLoading, error } = useDetail(campaignId, stationId, sensorId);

  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [number, number] | null
  >(null);

  const [aggregationInterval, setAggregationInterval] =
    useState<AggregationInterval | null>(null);

  useEffect(() => {
    if (data) {
      if (data.firstMeasurementTime && data.lastMeasurementTime) {
        setAggregationInterval(
          selectAggregationInterval(
            data.firstMeasurementTime,
            data.lastMeasurementTime,
          ),
        );
      } else {
        setAggregationInterval('minute');
      }
    }
  }, [data]);

  const handleAggregationIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setAggregationInterval(event.target.value as AggregationInterval);
  };

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      {data && (
        <div className="flex flex-col items-center  h-screen">
          <MeasurementSummary data={data} />
          <div className="mb-4">
            <label htmlFor="aggregationInterval" className="mr-2">
              Aggregation Interval:
            </label>
            <select
              id="aggregationInterval"
              value={aggregationInterval || ''}
              onChange={handleAggregationIntervalChange}
              className="p-2 border rounded"
            >
              {AGGREGATION_INTERVALS.map((interval) => (
                <option key={interval} value={interval}>
                  {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {aggregationInterval && (
            <Chart
              campaignId={campaignId}
              stationId={stationId}
              sensorId={sensorId}
              selectedTimeRange={selectedTimeRange}
              setSelectedTimeRange={setSelectedTimeRange}
              aggregationInterval={aggregationInterval}
            />
          )}
        </div>
      )}
    </QueryWrapper>
  );
};

export default LineConfidenceViz;
