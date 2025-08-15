import QueryWrapper from '../../../common/QueryWrapper';
import MeasurementSummary from '../../../SensorDashboard/_components/MeasurementSummary';
import { Chart } from './_components/Chart';
import { AdditionalSensorsList } from './_components/AdditionalSensorsList';
import {
  LineConfidenceProvider,
  useLineConfidence,
} from './context/LineConfidenceContext';
import Controls from './_components/Controls';
import SensorFilteringModal from './_components/SensorFilteringModal';
import {useDetail as campaignInfo} from '../../../../hooks/campaign/useDetail';
import { useDetail as stationInfo } from '../../../../hooks/station/useDetail';
import { useDetail } from '../../../../hooks/sensor/useDetail';
import { renderChm } from '../../../../utils/helpers';

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
  const { campaign } = campaignInfo(campaignId);
  const { station } = stationInfo(campaignId, stationId);
  const { data:sensor } = useDetail(campaignId, stationId, sensorId);

  return (
    <div className="px-4 md:px-8 lg:px-12 lg:py-12 lg:h-5/6 py-12">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8 mb-6">
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
          <a href='#' className='active'>Confidence</a>
        </div>
      </div>
      <LineConfidenceProvider
        campaignId={campaignId}
        stationId={stationId}
        sensorId={sensorId}
      >
        <LineConfidenceContent />
      </LineConfidenceProvider>
    </div>
  );
};

// Inner component that uses the context
const LineConfidenceContent = () => {
  const { data, isLoading, error, addSensorModalOpen } = useLineConfidence();

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      {data && (
        <div className="mx-auto flex flex-col max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <MeasurementSummary data={data} />
          <Controls />
          <AdditionalSensorsList />
          <Chart />
          {addSensorModalOpen && <SensorFilteringModal />}
        </div>
      )}
    </QueryWrapper>
  );
};

export default LineConfidenceViz;
