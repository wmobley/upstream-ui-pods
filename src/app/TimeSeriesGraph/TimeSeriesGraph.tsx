import QueryWrapper from '../common/QueryWrapper';
import MeasurementSummary from '../SensorDashboard/_components/MeasurementSummary';
import Chart from './_components/Chart';
import { useDetail } from '../../hooks/sensor/useDetail';
interface TimeSeriesGraphProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
  initialDownsampleThreshold?: number;
}

const TimeSeriesGraph = ({
  campaignId,
  stationId,
  sensorId,
}: TimeSeriesGraphProps) => {
  const { data, isLoading, error } = useDetail(campaignId, stationId, sensorId);
  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="flex flex-col items-center justify-center h-screen">
        {data && <MeasurementSummary data={data} />}
        <Chart
          campaignId={campaignId}
          stationId={stationId}
          sensorId={sensorId}
        />
      </div>
    </QueryWrapper>
  );
};

export default TimeSeriesGraph;
