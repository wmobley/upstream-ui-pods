import HeatMap from '../../../HeatMap';
import StatsWidget from './_components/StatsWidget';
// import { MapWidget, StatsWidget } from './widgets';
// import { Navigation, ExportButton, FilterControls } from './controls';

interface CampaignDashboardProps {
  campaignId: string;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaignId,
}) => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
      {/* Header Section */}
      <header className="mb-8">
        {/* <Navigation /> */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold">Urban Air Quality Study</h1>
          <p className="text-gray-600">March 15, 2023 - March 20, 2023</p>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Campaign Route</h2>
          {/* <MapWidget campaignId={campaignId} /> */}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Campaign Statistics</h2>
          <StatsWidget campaignId={campaignId} />
        </div>
      </section>
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Hotspots Detected </h2>
          <div className="flex gap-4">
            {/* <FilterControls /> */}
            {/* <ExportButton onExport={() => {}} /> */}
          </div>
        </div>
        <HeatMap campaignId={campaignId} />
      </section>
    </div>
  );
};

export default CampaignDashboard;
