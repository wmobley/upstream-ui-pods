import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContextState';
import { initiateOAuthLogin } from '../../utils/tapisAuth';
import { friendlyErrorMessage } from '../../utils/apiError';

interface LoginLocationState {
  from?: { pathname: string; search?: string };
}

const Login: React.FC = () => {
  const { isAuthenticated, error } = useAuth();
  const history = useHistory();
  // ProtectedRoute redirects here with `state.from` set to the deep link the
  // user was actually trying to reach, so login can return them to it
  // instead of always landing on `/`.
  const location = useLocation<LoginLocationState>();
  const returnTo = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search ?? ''}`
    : undefined;

  useEffect(() => {
    if (isAuthenticated) {
      history.replace('/');
      return;
    }
    if (!error) {
      initiateOAuthLogin(returnTo);
    }
  }, [isAuthenticated, error, history, returnTo]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-login">
        <div className="max-w-md w-full p-8 bg-white shadow-lg text-center">
          <p className="text-red-600 mb-6">{friendlyErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => initiateOAuthLogin(returnTo)}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            Log in with Tapis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-login">
      <p className="text-gray-500">Redirecting to Tapis login&hellip;</p>
    </div>
  );
};

export default Login;
