import React from 'react';
import {
  Route,
  useRouteMatch,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
import CampaignDashboard from '../_components/CampaignDashboard';
import Station from '../../Station';

const Router: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`/campaigns/:campaignId/stations`}>
        <Station />
      </Route>
      <Route
        exact
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
