import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Campaign from '../Campaign';
import ProtectedRoute from '../common/ProtectedRoute';
import Login from '../Login/Login';
import useAccessToken from '../../hooks/auth/useAccessToken';
const Router: React.FC = () => {
  const { accessToken } = useAccessToken();
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <ProtectedRoute accessToken={accessToken} path="/campaigns">
        <Campaign />
      </ProtectedRoute>
    </Switch>
  );
};

export default Router;
