import { useList } from '../../../hooks/measurements/useList';
import QueryWrapper from '../../common/QueryWrapper';

interface MeasurementsSummaryProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

const MeasurementsSummary = ({
  campaignId,
  stationId,
  sensorId,
}: MeasurementsSummaryProps) => {
  const { data, isLoading, error } = useList(campaignId, stationId, sensorId);
  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <h2 className="text-xl font-semibold mb-4">Measurements</h2>
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Total</p>
        <p className="font-medium">{data?.total}</p>
        <p className="text-sm text-gray-600">Average</p>
        <p className="font-medium">{data?.averageValue}</p>
        <p className="text-sm text-gray-600">Minimum</p>
        <p className="font-medium">{data?.minValue}</p>
        <p className="text-sm text-gray-600">Maximum</p>
        <p className="font-medium">{data?.maxValue}</p>
      </div>
    </QueryWrapper>
  );
};

export default MeasurementsSummary;
