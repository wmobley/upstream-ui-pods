import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import StationDashboard from '../../StationDashboard/StationDashboard';
import Sensor from '../../Sensor';
const Router: React.FC = () => {
  return (
    <Switch>
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
