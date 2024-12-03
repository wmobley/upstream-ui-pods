import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useTapisConfig from '../../hooks/authenticator/useTapisConfig';
const OAuth2: React.FC = () => {
  const { setAccessToken } = useTapisConfig();
  const navigate = useHistory();

  const queryString = window.location.href;
  const access_token = queryString.substring(
    queryString.indexOf('access_token=') + 13,
    queryString.lastIndexOf('&state'),
  );
  const expires_at = 't';
  const expires_in = 14400;

  useEffect(() => {
    console.log('access_token', access_token);
    console.log('expires_at', expires_at);
    console.log('expires_in', expires_in);
    setAccessToken({ access_token, expires_at, expires_in });
    navigate.push(`/`);
    // eslint-disable-next-line
  }, []);

  return <div>OAuth2</div>;
};

export default OAuth2;
