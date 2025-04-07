import { useState, useMemo } from 'react';
import CampaignCard from '../CampaignCard/CampaignCard';
import QueryWrapper from '../../../common/QueryWrapper';
import { useList } from '../../../../hooks/campaign/useList';
import { LatLngBounds } from 'leaflet';
import FilterToolbar from '../../../common/FilterToolbar/FilterToolbar';
import FilteringVariablesButton from '../CampaignFilterToolbar/_components/FilteringVariables/FilteringVariablesButton/FilteringVariablesButton';

const CampaignList: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [sensorVariables, setSensorVariables] = useState<string[]>([]);

  const filters = useMemo(
    () => ({
      startDate,
      endDate,
      bbox: bounds
        ? [
            bounds?.getNorthEast().lat,
            bounds?.getNorthEast().lng,
            bounds?.getSouthWest().lat,
            bounds?.getSouthWest().lng,
          ].join(',')
        : undefined,
      sensorVariables: sensorVariables.length > 0 ? sensorVariables : undefined,
    }),
    [startDate, endDate, bounds, sensorVariables],
  );

  const {
    data: campaigns,
    isLoading,
    error,
  } = useList({
    filters,
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

        <FilterToolbar
          title="Campaign Filters"
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onBoundsChange={setBounds}
        >
          <FilteringVariablesButton
            sensorVariables={sensorVariables}
            onSubmit={setSensorVariables}
            onClear={() => setSensorVariables([])}
          />
        </FilterToolbar>

        <QueryWrapper isLoading={isLoading} error={error}>
          {campaigns && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {campaigns.map((campaign) => (
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
