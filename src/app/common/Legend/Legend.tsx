import { Interval } from '../../common/types';
import { getColorByPercentile } from '../Intervals';
import { formatNumber } from '../NumberFormatter/NumberFortatterUtils';

interface LegendProps {
  title: React.ReactNode;
  intervals: Interval[];
  selectedInterval: Interval | null;
  onIntervalSelect: (interval: Interval | null) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

export default function Legend({
  title,
  intervals,
  selectedInterval,
  onIntervalSelect,
  opacity,
  onOpacityChange,
}: LegendProps) {
  return (
    <div className="absolute bottom-16 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <button
            className={`text-sm px-2 py-1 rounded ${
              !selectedInterval ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => onIntervalSelect(null)}
          >
            Show All Intervals
          </button>
        </div>
        {[...intervals].reverse().map((interval, index) => (
          <div
            key={index}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onIntervalSelect(interval)}
          >
            <div
              className={`w-4 h-4 rounded-full ${
                selectedInterval === interval ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                backgroundColor: getColorByPercentile(
                  interval.minPercentile,
                  intervals,
                ),
              }}
            />
            <span className="text-sm">
              {interval.minPercentile}% - {interval.maxPercentile}% (
              {formatNumber(interval.minValue)} -{' '}
              {formatNumber(interval.maxValue)})
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Transparency
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xs text-gray-500 w-10 text-right">
            {Math.round(opacity * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
