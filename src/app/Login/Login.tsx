import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContextState';
import { initiateOAuthLogin } from '../../utils/tapisAuth';

const Login: React.FC = () => {
  const { isAuthenticated, error } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated) {
      history.replace('/');
      return;
    }
    if (!error) {
      initiateOAuthLogin();
    }
  }, [isAuthenticated, error, history]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-login">
        <div className="max-w-md w-full p-8 bg-white shadow-lg text-center">
          <p className="text-red-600 mb-6">{error.message}</p>
          <button
            type="button"
            onClick={() => initiateOAuthLogin()}
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
