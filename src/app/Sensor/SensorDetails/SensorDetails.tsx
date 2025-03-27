import { useDetail } from '../../../hooks/sensor/useDetail';
import QueryWrapper from '../../common/QueryWrapper';
import MeasurementsSummary from '../Measurements/MeasurementsSummary';
interface SensorDetailsProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

const SensorDetails: React.FC<SensorDetailsProps> = ({
  campaignId,
  stationId,
  sensorId,
}) => {
  const { data, isLoading, error } = useDetail(campaignId, stationId, sensorId);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <section className="bg-white rounded-lg shadow-md p-6">
        {data ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">{data.variablename}</h2>
            <div className="space-y-4">
              {/* Add sensor details here */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Variable Name</p>
                  <p className="font-medium">{data.variablename}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Units</p>
                  <p className="font-medium">{data.units}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Alias</p>
                  <p className="font-medium">{data.alias}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{data.description}</p>
              </div>
              <MeasurementsSummary
                campaignId={campaignId}
                stationId={stationId}
                sensorId={sensorId}
              />
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            Select a sensor from the list to view details
          </div>
        )}
      </section>
    </QueryWrapper>
  );
};

export default SensorDetails;
