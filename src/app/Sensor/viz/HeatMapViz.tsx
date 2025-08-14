import HeatMap from '../../HeatMap/HeatMap';
import { useList } from '../../../hooks/measurements/useList';
import QueryWrapper from '../../common/QueryWrapper';
import { useMemo } from 'react';
import {useDetail as campaignInfo} from '../../../hooks/campaign/useDetail';
import { useDetail as stationInfo } from '../../../hooks/station/useDetail';
import { useDetail } from '../../../hooks/sensor/useDetail';
import { renderChm } from '../../../utils/helpers';

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

  const { campaign } = campaignInfo(campaignId);
  const { station } = stationInfo(campaignId, stationId);
  const { data:sensor } = useDetail(campaignId, stationId, sensorId);

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

      <div className="absolute top-[110px] left-12 z-[1000] bg-white py-1 px-3 rounded-md shadow-lg">
        <div className='breadcrumbs text-xs'>
          <a href='/'>Campaigns</a>
          <span>&gt;</span>
          <a href={'/campaigns/' + campaignId}>{ campaign?.name || "campaign " + campaignId + " ..." }</a>
          <span>&gt;</span>
          <a href={'/campaigns/' + campaignId + "/stations/" + stationId}>{ station?.name || "station " + campaignId + " ..." }</a>
          <span>&gt;</span>
          <a href={'/campaigns/' + campaignId + "/stations/" + stationId + '/sensors/' + sensorId}>
            {renderChm(sensor?.variablename || sensor?.alias || 'sensor ' + sensorId)}
          </a>
          <span>&gt;</span>
          <a href='#' className='active'>Heat Map</a>
        </div>
      </div>
    </QueryWrapper>
  );
};

export default HeatMapViz;
