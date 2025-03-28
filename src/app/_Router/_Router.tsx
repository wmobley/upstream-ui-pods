import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Campaign from '../Campaign';
import ProtectedRoute from '../common/ProtectedRoute';
import Login from '../Login/Login';
import { useAuth } from '../../contexts/AuthContext';
import QueryWrapper from '../common/QueryWrapper';
import TimeSeriesGraph from '../TimeSeriesGraph/TimeSeriesGraph';

const Router: React.FC = () => {
  const { isAuthenticated, isLoading, error } = useAuth();

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/time-series-graph">
          <TimeSeriesGraph />
        </Route>
        <ProtectedRoute isAuthenticated={isAuthenticated} path="/campaigns">
          <Campaign />
        </ProtectedRoute>
      </Switch>
    </QueryWrapper>
  );
};

export default Router;
