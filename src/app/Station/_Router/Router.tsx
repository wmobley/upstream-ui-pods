import React from 'react';
import {
  Route,
  useRouteMatch,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
import StationDashboard from '../_components/StationDashboard';
import RouteMapViz from '../../Sensor/viz/RouteMapViz';
import HeatMapViz from '../../Sensor/viz/HeatMapViz';
import ScatterTimeViz from '../../Sensor/viz/ScatterTimeViz';
const Router: React.FC = () => {
  const { path } = useRouteMatch();
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
        path={`/campaigns/:campaignId/stations/:stationId/sensors/:sensorId/viz/route-map`}
        render={({
          match: {
            params: { campaignId, stationId, sensorId },
          },
        }: RouteComponentProps<{
          campaignId: string;
          stationId: string;
          sensorId: string;
        }>) => (
          <RouteMapViz
            campaignId={campaignId}
            stationId={stationId}
            sensorId={sensorId}
          />
        )}
      />
      <Route
        path={`/campaigns/:campaignId/stations/:stationId/sensors/:sensorId/viz/heat-map`}
        render={({
          match: {
            params: { campaignId, stationId, sensorId },
          },
        }: RouteComponentProps<{
          campaignId: string;
          stationId: string;
          sensorId: string;
        }>) => (
          <HeatMapViz
            campaignId={campaignId}
            stationId={stationId}
            sensorId={sensorId}
          />
        )}
      />
      <Route
        path={`/campaigns/:campaignId/stations/:stationId/sensors/:sensorId/viz/scatter-time`}
        render={({
          match: {
            params: { campaignId, stationId, sensorId },
          },
        }: RouteComponentProps<{
          campaignId: string;
          stationId: string;
          sensorId: string;
        }>) => (
          <ScatterTimeViz
            campaignId={campaignId}
            stationId={stationId}
            sensorId={sensorId}
          />
        )}
      />
    </Switch>
  );
};

export default Router;
