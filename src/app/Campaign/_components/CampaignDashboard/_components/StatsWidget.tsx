import {
  FaRoute,
  FaClock,
  FaExclamationTriangle,
  FaChartLine,
} from 'react-icons/fa';

interface StatsWidgetProps {
  campaignId: string;
}

const StatsWidget: React.FC<StatsWidgetProps> = () => {
  // Mock data - replace with actual API calls later
  const stats = {
    totalDistance: '127.5 [unit]',
    duration: '5 [unit]',
    avgVOC: '2.3 [unit]',
    hotspots: 8,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total Distance */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <FaRoute className="text-blue-500 text-xl" />
          <h3 className="text-gray-600 font-medium">Metric Example 1</h3>
        </div>
        <p className="text-2xl font-bold">{stats.totalDistance}</p>
      </div>

      {/* Campaign Duration */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <FaClock className="text-blue-500 text-xl" />
          <h3 className="text-gray-600 font-medium">Metric Example 2</h3>
        </div>
        <p className="text-2xl font-bold">{stats.duration}</p>
      </div>

      {/* Average VOC Levels */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <FaChartLine className="text-blue-500 text-xl" />
          <h3 className="text-gray-600 font-medium">Metric Example 3</h3>
        </div>
        <p className="text-2xl font-bold">{stats.avgVOC}</p>
      </div>

      {/* Hotspots Detected */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <FaExclamationTriangle className="text-orange-500 text-xl" />
          <h3 className="text-gray-600 font-medium">Metric Example 4</h3>
        </div>
        <p className="text-2xl font-bold">{stats.hotspots}</p>
      </div>
    </div>
  );
};

export default StatsWidget;
