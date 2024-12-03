import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Login from '../Login/Login';
import OAuth2 from '../Login/OAuth2';
import useTapisConfig from '../../hooks/authenticator/useTapisConfig';
import { Authenticator } from '@tapis/tapisui-hooks';

const Router: React.FC = () => {
  const { accessToken } = useTapisConfig();
  const { logout } = Authenticator.useLogin();

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route path="/oauth2/callback">
        <OAuth2 />
      </Route>
    </Switch>
  );
};

export default Router;
