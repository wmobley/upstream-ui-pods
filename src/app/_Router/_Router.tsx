import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import OAuth2 from '../Login/OAuth2';
import Campaign from '../Campaign';
import ProtectedRoute from '../common/ProtectedRoute';
import { useTapisConfig } from '@tapis/tapisui-hooks';
import Login from '../Login/Login';

const Router: React.FC = () => {
  const { accessToken } = useTapisConfig();
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/oauth2/callback">
        <OAuth2 />
      </Route>
      <ProtectedRoute accessToken={accessToken?.access_token} path="/campaigns">
        <Campaign />
      </ProtectedRoute>
    </Switch>
  );
};

export default Router;
