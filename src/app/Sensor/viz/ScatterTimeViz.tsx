import { useList } from '../../../hooks/measurements/useList';
import RouterMap from '../../RouterMap/RouterMap';
import QueryWrapper from '../../common/QueryWrapper';
import TimeSeriesGraph from '../../TimeSeriesGraph/TimeSeriesGraph';
interface MeasurementsSummaryProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

const RouteMapViz = ({
  campaignId,
  stationId,
  sensorId,
}: MeasurementsSummaryProps) => {
  return (
    <TimeSeriesGraph
      campaignId={campaignId}
      stationId={stationId}
      sensorId={sensorId}
    />
  );
};

export default RouteMapViz;
