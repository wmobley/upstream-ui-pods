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
      const oauthClientId = 'dso-tacc-netlify';
      const targetUrl = `https://portals.tapis.io/v3/oauth2/login?redirect_uri=${encodeURIComponent(
        callbackUrl,
      )}&response_type=token&client_id=${oauthClientId}`;
      window.location.href = targetUrl;
    }
  }, [accessToken]);

  return <Loading loadingMessage="Logging in..." />;
};

export default Login;
