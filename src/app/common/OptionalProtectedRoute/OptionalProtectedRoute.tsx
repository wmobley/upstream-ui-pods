import React from 'react';
import { Route } from 'react-router-dom';

// A wrapper for <Route> that allows both authenticated and unauthenticated access
// Used for routes that should show published data to everyone, but full data to authenticated users
type OptionalProtectedRouteProps = {
  path: string;
  exact?: boolean;
};

const OptionalProtectedRoute: React.FC<
  React.PropsWithChildren<OptionalProtectedRouteProps>
> = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      exact={rest.exact}
      render={() => children}
    />
  );
};

export default OptionalProtectedRoute;