import HeatMap from '../../HeatMap/HeatMap';
import { useList } from '../../../hooks/measurements/useList';
import QueryWrapper from '../../common/QueryWrapper';

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

  const intervals = [
    {
      minPercentile: 0,
      maxPercentile: 5,
      minValue: -0.069960798,
      maxValue: 0.059607505500000005,
    },
    {
      minPercentile: 5,
      maxPercentile: 25,
      minValue: 0.059607505500000005,
      maxValue: 0.12258119549999999,
    },
    {
      minPercentile: 25,
      maxPercentile: 50,
      minValue: 0.12258119549999999,
      maxValue: 0.181306966,
    },
    {
      minPercentile: 50,
      maxPercentile: 75,
      minValue: 0.181306966,
      maxValue: 0.275758879,
    },
    {
      minPercentile: 75,
      maxPercentile: 95,
      minValue: 0.275758879,
      maxValue: 0.622420244,
    },
    {
      minPercentile: 95,
      maxPercentile: 100,
      minValue: 0.622420244,
      maxValue: 7.286059643,
    },
  ];
  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <HeatMap measurements={data?.items || []} intervals={intervals} />
    </QueryWrapper>
  );
};

export default HeatMapViz;
