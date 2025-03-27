import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Campaign from '../Campaign';
import ProtectedRoute from '../common/ProtectedRoute';
import Login from '../Login/Login';
import { useAuth } from '../../contexts/AuthContext';

const Router: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <ProtectedRoute isAuthenticated={isAuthenticated} path="/campaigns">
        <Campaign />
      </ProtectedRoute>
    </Switch>
  );
};

export default Router;
