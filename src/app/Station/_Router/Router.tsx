import React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import StationDashboard from '../../StationDashboard/StationDashboard';
import RouteMapViz from '../../Sensor/viz/RouteMapViz';
import HeatMapViz from '../../Sensor/viz/HeatMapViz';
import ScatterTimeViz from '../../Sensor/viz/ScatterTimeViz';
import LineConfidenceViz from '../../Sensor/viz/LineConfidenceViz';
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
      <Route
        path={`/campaigns/:campaignId/stations/:stationId/sensors/:sensorId/viz/line-confidence`}
        render={({
          match: {
            params: { campaignId, stationId, sensorId },
          },
        }: RouteComponentProps<{
          campaignId: string;
          stationId: string;
          sensorId: string;
        }>) => (
          <LineConfidenceViz
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
