import { useState } from 'react';
import { AuthApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const config = useConfiguration();
  const authApi = new AuthApi(config);

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.loginApiV1TokenPost({
        username: email,
        password: password,
      });

      // Store token in localStorage
      localStorage.setItem('access_token', response.access_token);

      return response.data as LoginResponse;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to login'));
      console.error('Error during login:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    setEmail,
    setPassword,
    email,
    password,
    isLoading,
    error,
  };
};

export default useLogin;
