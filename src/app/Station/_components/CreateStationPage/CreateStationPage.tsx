import React from 'react';
import { useParams } from 'react-router-dom';
import CreateStationForm from '../CreateStation/CreateStationForm';

interface CreateStationPageParams {
  campaignId: string;
}

const CreateStationPage: React.FC = () => {
  const { campaignId } = useParams<CreateStationPageParams>();

  if (!campaignId) {
    return <div>Error: Campaign ID not found</div>;
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
        <CreateStationForm campaignId={campaignId} />
      </div>
    </div>
  );
};

export default CreateStationPage;