import React, { useEffect } from 'react';
import { useTapisConfig } from '@tapis/tapisui-hooks';

const OAuth2: React.FC = () => {
  const { setAccessToken } = useTapisConfig();

  const queryString = window.location.href;
  const access_token = queryString.substring(
    queryString.indexOf('access_token=') + 13,
    queryString.lastIndexOf('&state'),
  );
  const expires_at = 't';
  const expires_in = 14400;

  useEffect(() => {
    setAccessToken({ access_token, expires_at, expires_in });
    window.location.href = '/';
  }, [access_token, expires_at, expires_in, setAccessToken]);

  return <div>OAuth2</div>;
};

export default OAuth2;
