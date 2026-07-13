import React, { useEffect, useState, ReactNode } from 'react';
import { AuthApi, Configuration } from '@upstream/upstream-api';
import {
  initializeTapisAuth,
  clearTapisHeaders,
  getTapisUser,
  storeTapisTokens,
  clearTapisTokens,
} from '../utils/tapisAuth';
import { AuthContext } from './AuthContextState';

interface AuthProviderProps {
  children: ReactNode;
}

function getLoginBasePath(): string {
  const runtimeUrl = window.__UPSTREAM_CONFIG__?.VITE_UPSTREAM_API_URL?.trim();
  const envUrl = import.meta.env.VITE_UPSTREAM_API_URL?.trim();
  return (runtimeUrl ?? envUrl ?? 'http://127.0.0.1:8000').replace(/\/+$/, '');
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isTapisAuth, setIsTapisAuth] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const summarizeToken = (token: string | null | undefined) => ({
    exists: Boolean(token),
    length: token ? token.length : null,
    dots: token ? (token.match(/\./g) || []).length : null,
    prefix: token ? token.slice(0, 16) : null,
    suffix: token ? token.slice(-16) : null,
  });

  const applyJwtDetails = (token: string) => {
    try {
      const [, payloadBase64] = token.split('.');
      if (!payloadBase64) return;
      const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + (4 - (normalized.length % 4)) % 4, '=');
      const payload = JSON.parse(atob(padded)) as { username?: string; role?: string };
      if (payload.username) {
        setUsername(payload.username);
      }
      if (payload.role) {
        setRole(payload.role);
      }
    } catch (tokenError) {
      console.warn('[Auth] Failed to decode JWT payload', tokenError);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const expiresAt = sessionStorage.getItem('Tapis-Expires-At');
    if (!expiresAt) return;

    const expiresAtMs = parseInt(expiresAt, 10) * 1000;
    const msUntilExpiry = expiresAtMs - Date.now();

    const expire = () => {
      localStorage.removeItem('access_token');
      clearTapisHeaders();
      clearTapisTokens();
      setIsAuthenticated(false);
      setIsTapisAuth(false);
      setUsername(null);
      setRole(null);
      setError(new Error('Your session has expired. Please log in again.'));
    };

    if (msUntilExpiry <= 0) {
      expire();
      return;
    }

    const timer = setTimeout(expire, msUntilExpiry);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    const checkAuth = async () => {
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
        // Token present but JWT claims didn't map to expected header names —
        // still treat as authenticated so the app doesn't loop back to login.
        const hasToken = Boolean(sessionStorage.getItem('Tapis-Access-Token'));
        const partialUsername = sessionStorage.getItem('X-Tapis-Username');
        if (hasToken) {
          setIsAuthenticated(true);
          setIsTapisAuth(true);
          if (partialUsername) setUsername(partialUsername);
          setIsLoading(false);
          return;
        }
      }

      const token = localStorage.getItem('access_token');
      if (token) {
        setIsAuthenticated(true);
        setIsTapisAuth(false);
        applyJwtDetails(token);
      } else {
        setUsername(null);
        setRole(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const authApi = new AuthApi(new Configuration({ basePath: getLoginBasePath() }));
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.loginApiV1TokenPost({
        username: email,
        password,
      });

      // Debug: show the raw login response for troubleshooting tapis tokens
      // (Do not enable in production logs with real tokens.)
      console.debug('[Auth] login response:', response);
      console.debug('[Auth] tapis token from login response summary:', summarizeToken(response.tapisAccessToken ?? undefined));

      if (!response.accessToken) {
        throw new Error('No access token received');
      }

      // Treat a response that lacks both an Upstream role and a Tapis access token
      // as a failed login even if an access token was returned. This prevents bad
      // credentials from being treated as a successful session.
      const normalizedRole = (response.role || '').trim().toUpperCase();
      const hasUpstreamRole = Boolean(normalizedRole && normalizedRole !== 'NONE');
      const hasTapisAccessToken = Boolean(response.tapisAccessToken);

      if (!hasUpstreamRole && !hasTapisAccessToken) {
        throw new Error('Invalid username or password');
      }

      localStorage.setItem('access_token', response.accessToken);
      setRole(response.role ?? null);
      applyJwtDetails(response.accessToken);

      if (response.tapisAccessToken || response.tapisRefreshToken || response.tapisExpiresAt) {
        storeTapisTokens({
          accessToken: response.tapisAccessToken ?? undefined,
          refreshToken: response.tapisRefreshToken ?? undefined,
          expiresAt: response.tapisExpiresAt ?? undefined,
        });
        const storedTapisAccessToken =
          typeof window !== 'undefined' ? sessionStorage.getItem('Tapis-Access-Token') : null;
        console.debug('[Auth] tapis token stored in sessionStorage summary:', summarizeToken(storedTapisAccessToken));
        console.debug('[Auth] tapis token login/stored equality:', {
          same:
            Boolean(response.tapisAccessToken) &&
            Boolean(storedTapisAccessToken) &&
            response.tapisAccessToken === storedTapisAccessToken,
        });
      } else {
        clearTapisTokens();
      }

      setIsAuthenticated(true);

      // Only treat this session as Tapis-authenticated when the stored
      // Tapis headers contain a usable user (username/tenant/site). A
      // presence of a bare tapisAccessToken alone should not flip the
      // app into 'Tapis mode' where Authorization: Bearer is omitted.
      const tapisUser = getTapisUser();
      const hasTapisUser = Boolean(tapisUser && tapisUser.username && tapisUser.tenant && tapisUser.site);
      setIsTapisAuth(hasTapisUser);

      if (hasTapisUser) {
        setUsername(tapisUser?.username ?? email);
      } else {
        setUsername((prev) => prev ?? response.username ?? email);
      }
    } catch (err) {
      let errorMessage = 'Invalid username or password';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const apiError = err as { body?: { detail?: string; message?: string }; status?: number };
        if (apiError.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (apiError.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (apiError.body && typeof apiError.body === 'object') {
          errorMessage = apiError.body.detail || apiError.body.message || errorMessage;
        }
      }
      setError(new Error(errorMessage));
      console.error('Error during login:', err);
      clearTapisTokens();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    clearTapisHeaders();
    clearTapisTokens();
    setIsAuthenticated(false);
    setIsTapisAuth(false);
    setUsername(null);
     setRole(null);
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
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
