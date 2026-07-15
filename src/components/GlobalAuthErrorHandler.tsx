import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContextState';

/**
 * Subscribes to the React Query cache and calls logout() whenever any query
 * fails with a 401. This bridges the gap between API auth errors and AuthContext:
 * AuthProvider sits above the data-fetch layer and cannot observe query failures
 * directly, so this component — rendered inside both providers — wires them up.
 */
const GlobalAuthErrorHandler: React.FC = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    return queryClient.getQueryCache().subscribe((event) => {
      if (event.type !== 'updated') return;
      const { status, error } = event.query.state;
      if (status !== 'error' || !(error instanceof Error)) return;
      if (/\b401\b/.test(error.message)) {
        logout();
      }
    });
  }, [logout, queryClient]);

  return null;
};

export default GlobalAuthErrorHandler;
