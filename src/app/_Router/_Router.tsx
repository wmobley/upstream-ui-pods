import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Login from '../Login/Login';

const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
    </Switch>
  );
};

export default Router;
