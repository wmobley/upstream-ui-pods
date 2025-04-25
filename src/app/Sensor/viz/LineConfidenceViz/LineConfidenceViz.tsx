import QueryWrapper from '../../../common/QueryWrapper';
import MeasurementSummary from '../../../SensorDashboard/_components/MeasurementSummary';
import { Chart } from './_components/Chart';
import { AdditionalSensorsList } from './_components/AdditionalSensorsList';
import {
  LineConfidenceProvider,
  useLineConfidence,
} from './context/LineConfidenceContext';
import Controls from './_components/Controls';

interface MeasurementsSummaryProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

// Main Line Confidence component which wraps everything in the provider
const LineConfidenceViz = ({
  campaignId,
  stationId,
  sensorId,
}: MeasurementsSummaryProps) => {
  return (
    <LineConfidenceProvider
      campaignId={campaignId}
      stationId={stationId}
      sensorId={sensorId}
    >
      <LineConfidenceContent campaignId={campaignId} stationId={stationId} />
    </LineConfidenceProvider>
  );
};

// Inner component that uses the context
const LineConfidenceContent = ({
  campaignId,
  stationId,
}: {
  campaignId: string;
  stationId: string;
}) => {
  const { data, isLoading, error } = useLineConfidence();

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      {data && (
        <div className="mx-auto flex flex-col max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <MeasurementSummary data={data} />
          <Controls campaignId={campaignId} stationId={stationId} />
          <AdditionalSensorsList />
          <Chart />
        </div>
      )}
    </QueryWrapper>
  );
};

export default LineConfidenceViz;
