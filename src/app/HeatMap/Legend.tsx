import { Interval } from '../../hooks/campaign/useDetail';
import { getColorByPercentile } from './helpers';

function Legend({
  text,
  intervals,
  selectedInterval,
  onIntervalSelect,
}: {
  text: string;
  intervals: Interval[];
  selectedInterval: Interval | null;
  onIntervalSelect: (interval: Interval | null) => void;
}) {
  return (
    <div className="absolute bottom-8 right-8 z-[1000] bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-semibold mb-2">{text}</h3>
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
              {interval.minValue.toFixed(2)} - {interval.maxValue.toFixed(2)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Legend;
