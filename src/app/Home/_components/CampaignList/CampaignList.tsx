import { useState, useEffect } from 'react';
import CampaignCard from '../CampaignCard/CampaignCard';
import QueryWrapper from '../../../common/QueryWrapper';
import { useList } from '../../../../hooks/campaign/useList';
import CampaignFilterToolbar from '../CampaignFilterToolbar';

const CampaignList: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { data: campaigns, isLoading, error } = useList();

  // Set initial dates based on available campaigns
  useEffect(() => {
    if (campaigns?.length) {
      // Find earliest and latest dates from campaigns
      const dates = campaigns.map((campaign) => ({
        start: campaign.startDate ? new Date(campaign.startDate) : new Date(),
        end: campaign.endDate ? new Date(campaign.endDate) : new Date(),
      }));

      const earliestDate = new Date(
        Math.min(...dates.map((d) => d.start.getTime())),
      );
      const latestDate = new Date(
        Math.max(...dates.map((d) => d.end.getTime())),
      );

      // Set initial dates if not already set
      if (!startDate) {
        setStartDate(earliestDate.toISOString().split('T')[0]);
      }
      if (!endDate) {
        setEndDate(latestDate.toISOString().split('T')[0]);
      }
    }
  }, [campaigns]);

  // Filter campaigns based on date range only
  const filteredCampaigns = campaigns?.filter((campaign) => {
    if (!campaign.startDate || !campaign.endDate) return true;

    const campaignStart = new Date(campaign.startDate);
    const campaignEnd = new Date(campaign.endDate);
    const filterStart = startDate ? new Date(startDate) : null;
    const filterEnd = endDate ? new Date(endDate) : null;

    return (
      (!filterStart || campaignEnd >= filterStart) &&
      (!filterEnd || campaignStart <= filterEnd)
    );
  });

  return (
    <div
      className="px-4 md:px-8 lg:px-12 lg:my-12 lg:py-12 lg:h-5/6 my-12 py-12 bg-secondary-100"
      id="campaign-list"
    >
      <section className="mx-auto max-w-screen-xl px-4 lg:px-8 flex flex-col gap-10">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Explore campaigns
        </h2>

        <CampaignFilterToolbar
          selectedArea={selectedArea}
          selectedInstrument={selectedInstrument}
          onAreaChange={setSelectedArea}
          onInstrumentChange={setSelectedInstrument}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <QueryWrapper isLoading={isLoading} error={error}>
          {filteredCampaigns && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </QueryWrapper>
      </section>
    </div>
  );
};

export default CampaignList;
