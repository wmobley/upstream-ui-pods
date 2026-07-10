import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Campaign from '../Campaign';
import Login from '../Login/Login';
import OAuthCallback from '../OAuth/OAuthCallback';
import { useAuth } from '../../contexts/AuthContextState';
import { Loading } from '../common/Loading';
import ConfidenceMethodExplanation from '../Sensor/viz/ConfidenceMethodExplanation';
import Admin from '../Admin';

const Router: React.FC = () => {
  const { isLoading } = useAuth();

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

      {/* Public routes - authentication handled by backend via Tapis headers or JWT */}
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/campaigns">
        <Campaign />
      </Route>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/docs/confidence-explanation">
        <ConfidenceMethodExplanation />
      </Route>
    </Switch>
  );
};

export default Router;
