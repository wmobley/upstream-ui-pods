import { Link } from 'react-router-dom';
import { FaRoute, FaFire, FaChartLine } from 'react-icons/fa';
import { MdScatterPlot } from 'react-icons/md';
import { ListMeasurementsResponsePagination } from '@upstream/upstream-api';
import { formatNumber } from '../../common/NumberFormatter/NumberFortatterUtils';
interface MeasurementsSummaryProps {
  data: ListMeasurementsResponsePagination | null;
  campaignId: string;
  stationId: string;
  sensorId: string;
}

const MeasurementsSummary = ({
  data,
  campaignId,
  stationId,
  sensorId,
}: MeasurementsSummaryProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Measurements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
        <div className="flex flex-col items-center p-3 bg-white rounded-md shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="font-medium text-lg">{data?.total}</p>
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-md shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Average</p>
          <p className="font-medium text-lg">
            {formatNumber(data?.averageValue)}
          </p>
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-md shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Minimum</p>
          <p className="font-medium text-lg">{formatNumber(data?.minValue)}</p>
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-md shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Maximum</p>
          <p className="font-medium text-lg">{formatNumber(data?.maxValue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to={`/campaigns/${campaignId}/stations/${stationId}/sensors/${sensorId}/viz/route-map`}
          className="block"
        >
          <button className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-md transition-colors duration-200">
            <FaRoute className="text-lg" />
            <span>View Route Map</span>
          </button>
        </Link>
        <Link
          to={`/campaigns/${campaignId}/stations/${stationId}/sensors/${sensorId}/viz/heat-map`}
          className="block"
        >
          <button className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-md transition-colors duration-200">
            <FaFire className="text-lg" />
            <span>View Heat Map</span>
          </button>
        </Link>
        <Link
          to={`/campaigns/${campaignId}/stations/${stationId}/sensors/${sensorId}/viz/scatter-time`}
          className="block"
        >
          <button className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-md transition-colors duration-200">
            <MdScatterPlot className="text-lg" />
            <span>View Scatter Time</span>
          </button>
        </Link>
        <Link
          to={`/campaigns/${campaignId}/stations/${stationId}/sensors/${sensorId}/viz/line-confidence`}
          className="block"
        >
          <button className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-md transition-colors duration-200">
            <FaChartLine className="text-lg" />
            <span>View Line Confidence</span>
          </button>
        </Link>
      </div>
    </>
  );
};

export default MeasurementsSummary;
