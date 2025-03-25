import { useState } from 'react';
import { AuthApi, Configuration } from '@upstream/upstream-api';

const basePath = 'https://upstream-dso.tacc.utexas.edu';
const config = new Configuration({ basePath });
const authApi = new AuthApi(config);

interface LoginResponse {
  access_token: string;
  token_type: string;
}

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
