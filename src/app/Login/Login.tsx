import React, { useEffect } from 'react';
import { useTapisConfig } from '@tapis/tapisui-hooks';
import Loading from '../common/Loading/Loading';

const Login: React.FC = () => {
  const { accessToken } = useTapisConfig();

  useEffect(() => {
    if (accessToken?.access_token) {
      window.location.href = '/';
    } else {
      const callbackUrl = `${window.location.origin}/oauth2/callback`;
      const oauthClientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
      const loginUrl = import.meta.env.VITE_TAPIS_LOGIN_URL;

      if (!oauthClientId) {
        throw new Error(
          'VITE_OAUTH_CLIENT_ID is required in environment variables',
        );
      }

      if (!loginUrl) {
        throw new Error(
          'VITE_TAPIS_LOGIN_URL is required in environment variables',
        );
      }

      const targetUrl = `${loginUrl}?redirect_uri=${encodeURIComponent(
        callbackUrl,
      )}&response_type=token&client_id=${oauthClientId}`;
      window.location.href = targetUrl;
    }
  }, [accessToken]);

  return <Loading loadingMessage="Logging in..." />;
};

export default Login;
