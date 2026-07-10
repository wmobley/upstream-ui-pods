import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { exchangeOAuthCode } from '../../utils/tapisAuth';

const OAuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const oauthError = params.get('error');

    if (oauthError) {
      setError(`Authorization failed: ${oauthError}`);
      return;
    }
    if (!code) {
      setError('No authorization code received from Tapis.');
      return;
    }

    exchangeOAuthCode(code)
      .then(() => {
        // Full page navigation so AuthContext re-runs its mount check with the
        // newly stored Tapis token.
        window.location.href = '/';
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Token exchange failed.');
      });
  }, [location.search]);

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full p-8 bg-white shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">Login Failed</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-gray-600">Completing Tapis login&hellip;</p>
    </div>
  );
};

export default OAuthCallback;
