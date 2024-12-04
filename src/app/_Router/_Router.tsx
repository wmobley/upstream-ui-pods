import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import OAuth2 from '../Login/OAuth2';
import Campaign from '../Campaign';

const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/oauth2/callback">
        <OAuth2 />
      </Route>
      <Route path="/campaigns">
        <Campaign />
      </Route>
    </Switch>
  );
};

export default Router;
