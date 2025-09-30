import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import StationDashboard from '../../StationDashboard/StationDashboard';
import CreateStationPage from '../_components/CreateStationPage';
import Sensor from '../../Sensor';
const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path={`/campaigns/:campaignId/stations/new`}>
        <CreateStationPage />
      </Route>
      <Route
        exact
        path={`/campaigns/:campaignId/stations/:stationId`}
        render={({
          match: {
            params: { campaignId, stationId },
          },
        }: RouteComponentProps<{ campaignId: string; stationId: string }>) => (
          <StationDashboard campaignId={campaignId} stationId={stationId} />
        )}
      />
      <Route
        path={`/campaigns/:campaignId/stations/:stationId/sensors/:sensorId`}
      >
        <Sensor />
      </Route>
    </Switch>
  );
};

export default Router;
