import {
  FaChartBar,
  FaChartLine,
  FaClock,
  FaRuler,
  FaChartPie,
} from 'react-icons/fa6';
import { formatNumber } from '../../common/NumberFormatter/NumberFortatterUtils';
import { GetSensorResponse } from '@upstream/upstream-api';
import { FaCalendarAlt } from 'react-icons/fa';

interface MeasurementSummaryProps {
  data: GetSensorResponse;
}

export const MeasurementSummary = ({ data }: MeasurementSummaryProps) => {
  return (
    <div className="flex flex-col ">
      <h1 className="text-2xl font-bold mb-4">{data.variablename}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              {data.firstMeasurementTime?.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              {data.firstMeasurementTime?.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaClock className="text-orange-500 text-2xl mr-3" />
          <div>
            <p className="text-sm text-gray-500">Last Measurement</p>
            <p className="font-medium">
              {data.lastMeasurementTime?.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              {data.lastMeasurementTime?.toLocaleTimeString()}
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
    </div>
  );
};

export default MeasurementSummary;
