import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Campaign from '../Campaign';
import Login from '../Login/Login';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../common/Loading';
import ConfidenceMethodExplanation from '../Sensor/viz/ConfidenceMethodExplanation';

const Router: React.FC = () => {
  const { isLoading, isTapisAuth } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Switch>
      {/* Login route - only needed for JWT auth, not Tapis */}
      {!isTapisAuth && (
        <Route exact path="/login">
          <Login />
        </Route>
      )}

      {/* Public routes - authentication handled by backend via Tapis headers or JWT */}
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/campaigns">
        <Campaign />
      </Route>
      <Route path="/docs/confidence-explanation">
        <ConfidenceMethodExplanation />
      </Route>
    </Switch>
  );
};

export default Router;
