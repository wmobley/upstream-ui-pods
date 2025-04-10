import HeatMap from '../../HeatMap/HeatMap';
import { useList } from '../../../hooks/measurements/useList';
import QueryWrapper from '../../common/QueryWrapper';
import { useMemo } from 'react';

const HeatMapViz = ({
  campaignId,
  stationId,
  sensorId,
}: {
  campaignId: string;
  stationId: string;
  sensorId: string;
}) => {
  const { data, isLoading, error } = useList(
    campaignId,
    stationId,
    sensorId,
    500000,
    5000,
  );

  const intervals = useMemo(() => {
    if (!data?.items || data.items.length === 0) return [];

    // Extract values and sort them
    const values = data.items
      .map((item) => item.value)
      .filter((value): value is number => value !== null)
      .sort((a, b) => a - b);

    // Define percentile breakpoints
    const percentiles = [0, 5, 25, 50, 75, 95, 100];

    // Calculate values at each percentile
    return percentiles.slice(0, -1).map((minPercentile, index) => {
      const maxPercentile = percentiles[index + 1];
      const minValue =
        values[Math.floor((minPercentile / 100) * values.length)];
      const maxValue =
        index === percentiles.length - 2
          ? values[values.length - 1]
          : values[Math.floor((maxPercentile / 100) * values.length)];

      return {
        minPercentile,
        maxPercentile,
        minValue,
        maxValue,
      };
    });
  }, [data]);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      {data && intervals && (
        <HeatMap measurements={data?.items || []} intervals={intervals} />
      )}
    </QueryWrapper>
  );
};

export default HeatMapViz;
