import React from 'react';
import CreateCampaignForm from '../CreateCampaign/CreateCampaignForm';

const CreateCampaignPage: React.FC = () => {
  return (
    <div className="px-4 md:px-8 lg:px-12 lg:py-12 py-12 bg-secondary-100 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="breadcrumbs mb-6">
          <a href="/">Explore campaigns</a>
          <span>&gt;</span>
          <a href="#" className="active">Create new campaign</a>
        </div>
        <CreateCampaignForm />
      </div>
    </div>
  );
};

export default CreateCampaignPage;