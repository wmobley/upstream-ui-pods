import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';

const Router: React.FC = () => {
  // const { accessToken } = useTapisConfig();
  // const { logout } = Authenticator.useLogin();
  // const { extension } = useExtension();

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      {/* <Route path="/login">
        <Login />
      </Route>
      <Route
        path="/logout"
        render={() => {
          logout();
          return <Redirect to="/login" />;
        }}
      />
      <Route path="/oauth2">
        <OAuth2 />
      </Route> */}
    </Switch>
  );
};

export default Router;
