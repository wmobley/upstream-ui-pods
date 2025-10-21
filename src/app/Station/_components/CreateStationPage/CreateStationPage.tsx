import React from 'react';
import { useParams } from 'react-router-dom';
import CreateStationForm from '../CreateStation/CreateStationForm';
import { useDetail as useCampaignDetail } from '../../../../hooks/campaign/useDetail';

interface CreateStationPageParams {
  campaignId: string;
}

const CreateStationPage: React.FC = () => {
  const { campaignId } = useParams<CreateStationPageParams>();
  const { campaign, isLoading, error } = useCampaignDetail(campaignId || '');

  if (!campaignId) {
    return <div>Error: Campaign ID not found</div>;
  }

  if (isLoading) {
    return <div className="px-4 md:px-8 lg:px-12 lg:py-12 py-12 bg-secondary-100 min-h-screen">Loading campaign…</div>;
  }

  if (error || !campaign) {
    return <div className="px-4 md:px-8 lg:px-12 lg:py-12 py-12 bg-secondary-100 min-h-screen">Failed to load campaign details.</div>;
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 lg:py-12 py-12 bg-secondary-100 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="breadcrumbs mb-6">
          <a href="/">Explore campaigns</a>
          <span>&gt;</span>
          <a href={`/campaigns/${campaignId}`}>Campaign</a>
          <span>&gt;</span>
          <a href="#" className="active">Create new station</a>
        </div>
        <CreateStationForm campaignId={campaignId} campaign={campaign} />
      </div>
    </div>
  );
};

export default CreateStationPage;
