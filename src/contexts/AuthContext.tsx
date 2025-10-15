import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { AuthApi } from '@upstream/upstream-api';
import useConfiguration from '../hooks/api/useConfiguration';
import {
  initializeTapisAuth,
  clearTapisHeaders,
  getTapisUser
} from '../utils/tapisAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isTapisAuth: boolean;
  username: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isTapisAuth, setIsTapisAuth] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const config = useConfiguration();
  const authApi = new AuthApi(config);

  useEffect(() => {
    const checkAuth = async () => {
      // First, check for Tapis authentication
      const tapisInitialized = initializeTapisAuth();

      if (tapisInitialized) {
        const tapisUser = getTapisUser();
        if (tapisUser) {
          setIsAuthenticated(true);
          setIsTapisAuth(true);
          setUsername(tapisUser.username);
          setIsLoading(false);
          return;
        }
      }

      // Fall back to JWT token authentication
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // You might want to add an API call here to validate the token
          // For now, we'll just check if it exists
          setIsAuthenticated(true);
          setIsTapisAuth(false);
          // Could decode JWT to get username if needed
        } catch (error) {
          console.error('Error checking authentication:', error);
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.loginApiV1TokenPost({
        username: email,
        password: password,
      });

      if (response.accessToken) {
        localStorage.setItem('access_token', response.accessToken);
        setIsAuthenticated(true);
      } else {
        throw new Error('No access token received');
      }
    } catch (err) {
      let errorMessage = 'Invalid username or password';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Try to extract error message from API response
        interface ApiError {
          body?: {
            detail?: string;
            message?: string;
          };
          status?: number;
        }
        const apiError = err as ApiError;

        if (apiError.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (apiError.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (apiError.body && typeof apiError.body === 'object') {
          errorMessage =
            apiError.body.detail || apiError.body.message || errorMessage;
        }
      }
      setError(new Error(errorMessage));
      console.error('Error during login:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    clearTapisHeaders();
    setIsAuthenticated(false);
    setIsTapisAuth(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        isTapisAuth,
        username,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
