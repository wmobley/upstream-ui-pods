import { useEffect, useState } from 'react';
import { useDetail } from '../../../../hooks/sensor/useDetail';
import { Chart } from './_components/Chart';
import { selectAggregationInterval } from '../../../../utils/aggregationProcessing';
import QueryWrapper from '../../../common/QueryWrapper';
import MeasurementSummary from '../../../SensorDashboard/_components/MeasurementSummary';
import { Link } from 'react-router-dom';

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
        throw new Error('No measurement time range found');
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
        <div className="flex flex-col items-center h-screen">
          <MeasurementSummary data={data} />
          <div className="mb-4 flex items-center justify-between w-full max-w-4xl">
            <div className="flex items-center">
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
            <Link
              to={`/sensor/confidence-explanation`}
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
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
