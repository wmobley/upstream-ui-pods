import TimeSeriesGraph from '../../TimeSeriesGraph';

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
