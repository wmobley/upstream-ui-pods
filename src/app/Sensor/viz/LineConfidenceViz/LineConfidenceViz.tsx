import { useEffect, useState } from 'react';
import { useDetail } from '../../../../hooks/sensor/useDetail';
import { Chart } from './_components/Chart';
import { selectAggregationInterval } from '../../../../utils/aggregationProcessing';
import QueryWrapper from '../../../common/QueryWrapper';
import {
  FaRuler,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';
import { formatNumber } from '../../../common/NumberFormatter/NumberFortatterUtils';

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
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">{data.variablename}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full max-w-4xl">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <FaRuler className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Alias</p>
                <p className="font-medium">{data.alias}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <FaRuler className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Units</p>
                <p className="font-medium">{data.units}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <FaCalendarAlt className="text-teal-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">First Measurement</p>
                <p className="font-medium">
                  {data.firstMeasurementTime?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <FaClock className="text-orange-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Last Measurement</p>
                <p className="font-medium">
                  {data.lastMeasurementTime?.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <FaChartLine className="text-purple-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Min Value</p>
                <p className="font-medium">
                  {data.minValue !== null && data.minValue !== undefined
                    ? formatNumber(data.minValue)
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <FaChartBar className="text-red-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Max Value</p>
                <p className="font-medium">
                  {data.maxValue !== null && data.maxValue !== undefined
                    ? formatNumber(data.maxValue)
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <FaChartPie className="text-yellow-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Average Value</p>
                <p className="font-medium">
                  {data.avgValue !== null && data.avgValue !== undefined
                    ? formatNumber(data.avgValue)
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <FaChartBar className="text-indigo-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Count</p>
                <p className="font-medium">{data.count}</p>
              </div>
            </div>
          </div>

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
