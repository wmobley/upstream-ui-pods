import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContextState';
import useConfiguration from '../hooks/api/useConfiguration';

/**
 * Fetches the upstream role for Tapis-authenticated sessions.
 *
 * AuthProvider sits above InstanceProvider in the tree, so it cannot call
 * useConfiguration (which needs selectedInstance from InstanceContext).
 * This component lives inside InstanceProvider and bridges the gap: once
 * Tapis auth is confirmed and the role is still unknown, it calls /users/me
 * with the correct API base URL.
 */
const RoleSyncOnTapisAuth: React.FC = () => {
  const { isTapisAuth, role, resolveRole } = useAuth();
  const config = useConfiguration();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isTapisAuth || role || hasSynced.current) return;
    if (!config.basePath) {
      console.warn('[RoleSync] No API base path available yet, skipping role fetch');
      return;
    }

    const tapisToken = sessionStorage.getItem('Tapis-Access-Token');
    console.log('[RoleSync] isTapisAuth=true, role=null, basePath=', config.basePath);
    console.log('[RoleSync] Tapis-Access-Token present:', Boolean(tapisToken));

    if (!tapisToken) {
      console.warn('[RoleSync] No Tapis token in sessionStorage, cannot fetch role');
      return;
    }

    hasSynced.current = true;
    resolveRole(config.basePath, tapisToken);
  }, [isTapisAuth, role, config.basePath, resolveRole]);

  return null;
};

export default RoleSyncOnTapisAuth;
