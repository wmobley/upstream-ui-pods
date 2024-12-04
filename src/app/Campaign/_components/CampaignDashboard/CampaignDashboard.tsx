interface CampaignDashboardProps {
  campaignId: string;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaignId,
}) => {
  return <div>CampaignDashboard {campaignId}</div>;
};

export default CampaignDashboard;
