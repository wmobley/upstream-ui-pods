import React from 'react';
import {
  Route,
  useRouteMatch,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
import CampaignDashboard from '../_components/CampaignDashboard';

const Router: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route
        path={`${path}/:campaignId`}
        render={({
          match: {
            params: { campaignId },
          },
        }: RouteComponentProps<{ campaignId: string }>) => (
          <CampaignDashboard campaignId={campaignId} />
        )}
      />
    </Switch>
  );
};

export default Router;
