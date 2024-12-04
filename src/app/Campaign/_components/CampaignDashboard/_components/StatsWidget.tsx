import {
  FaRoute,
  FaClock,
  FaExclamationTriangle,
  FaChartLine,
} from 'react-icons/fa';

interface StatsWidgetProps {
  campaignId: string;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ campaignId }) => {
  // Mock data - replace with actual API calls later
  const stats = {
    totalDistance: '127.5 km',
    duration: '5 days, 4 hours',
    avgVOC: '2.3 ppm',
    hotspots: 8,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total Distance */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <FaRoute className="text-blue-500 text-xl" />
          <h3 className="text-gray-600 font-medium">Total Distance</h3>
        </div>
        <p className="text-2xl font-bold">{stats.totalDistance}</p>
      </div>

      {/* Campaign Duration */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <FaClock className="text-blue-500 text-xl" />
          <h3 className="text-gray-600 font-medium">Duration</h3>
        </div>
        <p className="text-2xl font-bold">{stats.duration}</p>
      </div>

      {/* Average VOC Levels */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <FaChartLine className="text-blue-500 text-xl" />
          <h3 className="text-gray-600 font-medium">
            Average VOC
            <span
              className="ml-2 text-sm text-gray-500 cursor-help"
              title="Volatile Organic Compounds - measured in parts per million"
            >
              ⓘ
            </span>
          </h3>
        </div>
        <p className="text-2xl font-bold">{stats.avgVOC}</p>
      </div>

      {/* Hotspots Detected */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <FaExclamationTriangle className="text-orange-500 text-xl" />
          <h3 className="text-gray-600 font-medium">Hotspots Detected</h3>
        </div>
        <p className="text-2xl font-bold">{stats.hotspots}</p>
      </div>
    </div>
  );
};

export default StatsWidget;
