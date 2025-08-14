import { Interval } from '../../common/types';
import { getColorByPercentile } from '../Intervals';
import { formatNumber } from '../NumberFormatter/NumberFortatterUtils';

interface LegendProps {
  title: React.ReactNode;
  intervals: Interval[];
  selectedInterval: Interval | null;
  onIntervalSelect: (interval: Interval | null) => void;
}

export default function Legend({
  title,
  intervals,
  selectedInterval,
  onIntervalSelect,
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
        {intervals.map((interval, index) => (
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
    </div>
  );
}
