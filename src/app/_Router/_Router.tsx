import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Campaign from '../Campaign';
import Login from '../Login/Login';
import OAuthCallback from '../OAuth/OAuthCallback';
import { useAuth } from '../../contexts/AuthContextState';
import { Loading } from '../common/Loading';
import ProtectedRoute from '../common/ProtectedRoute';
import ConfidenceMethodExplanation from '../Sensor/viz/ConfidenceMethodExplanation';
import Admin from '../Admin';

const Router: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Switch>
      <Route exact path="/callback">
        <OAuthCallback />
      </Route>

      <Route exact path="/login">
        <Login />
      </Route>

      <Route exact path="/">
        <Home />
      </Route>
      <ProtectedRoute isAuthenticated={isAuthenticated} path="/campaigns">
        <Campaign />
      </ProtectedRoute>
      <ProtectedRoute isAuthenticated={isAuthenticated} path="/admin">
        <Admin />
      </ProtectedRoute>
      <Route path="/docs/confidence-explanation">
        <ConfidenceMethodExplanation />
      </Route>
    </Switch>
  );
};

export default Router;
