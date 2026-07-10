import React, { useState, useEffect } from 'react';
import {
  storeTapisHeaders,
  getTapisUser,
  clearTapisHeaders,
  isTapisAuthenticated,
  storeTapisTokens,
  clearTapisTokens,
} from '../utils/tapisAuth';
import type { TapisUser } from '../utils/tapisAuth';

/**
 * Development helper component for testing Tapis authentication.
 * Only visible in development mode.
 *
 * Allows developers to:
 * - Set test Tapis headers
 * - View current Tapis auth state
 * - Clear Tapis authentication
 */
const DevTapisAuthHelper: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState('testuser');
  const [tenant, setTenant] = useState('tacc');
  const [site, setSite] = useState('tacc');
  const [currentUser, setCurrentUser] = useState<TapisUser | null>(null);
  const [accessTokenInput, setAccessTokenInput] = useState('');
  const [hasStoredToken, setHasStoredToken] = useState(false);

  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (isDev) {
      updateCurrentUser();
      setHasStoredToken(Boolean(sessionStorage.getItem('Tapis-Access-Token')));
    }
  }, [isDev]);

  const updateCurrentUser = () => {
    if (isTapisAuthenticated()) {
      const user = getTapisUser();
      setCurrentUser(user ?? null);
    } else {
      setCurrentUser(null);
    }
  };

  const handleSetHeaders = () => {
    const internal = `${username}.${tenant}.${site}`;
    storeTapisHeaders({
      'X-Tapis-Username': username,
      'X-Tapis-Tenant': tenant,
      'X-Tapis-Site': site,
      'Internal': internal,
    });
    window.location.reload();
  };

  const handleClearHeaders = () => {
    clearTapisHeaders();
    clearTapisTokens();
    window.location.reload();
  };

  const handleQuickTest = () => {
    storeTapisHeaders({
      'X-Tapis-Username': 'testuser',
      'X-Tapis-Tenant': 'tacc',
      'X-Tapis-Site': 'tacc',
      'Internal': 'testuser.tacc.tacc',
    });
    window.location.reload();
  };

  const handleSetAccessToken = () => {
    if (!accessTokenInput.trim()) {
      alert('Paste a Tapis access token first.');
      return;
    }
    storeTapisTokens({ accessToken: accessTokenInput.trim() });
    window.location.reload();
  };

  const handleClearAccessToken = () => {
    clearTapisTokens();
    window.location.reload();
  };

  // Only show in development mode
  if (!isDev) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
    }}>
      {!isVisible ? (
        <button
          onClick={() => setIsVisible(true)}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        >
          🔧 Tapis Dev Tools
        </button>
      ) : (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          minWidth: '320px',
          border: '2px solid #4CAF50',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>🔧 Tapis Dev Tools</h3>
            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {currentUser ? (
            <div style={{
              padding: '10px',
              backgroundColor: '#e8f5e9',
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '13px',
            }}>
              <strong>✓ Tapis Authenticated</strong>
              <div>Username: {currentUser.username}</div>
              <div>Tenant: {currentUser.tenant}</div>
              <div>Site: {currentUser.site}</div>
            </div>
          ) : (
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3e0',
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '13px',
            }}>
              <strong>⚠ Not Tapis Authenticated</strong>
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px' }}>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px',
                  marginTop: '3px',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px' }}>
              Tenant:
              <input
                type="text"
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px',
                  marginTop: '3px',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px' }}>
              Site:
              <input
                type="text"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px',
                  marginTop: '3px',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handleSetHeaders}
              style={{
                padding: '8px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Set Tapis Headers
            </button>

            <button
              onClick={handleQuickTest}
              style={{
                padding: '8px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Quick Test (testuser@tacc)
            </button>

            <button
              onClick={handleClearHeaders}
              style={{
                padding: '8px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Clear Headers
            </button>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '8px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px' }}>
                Tapis Access Token (JWT):
                <textarea
                  value={accessTokenInput}
                  onChange={(e) => setAccessTokenInput(e.target.value)}
                  rows={3}
                  placeholder="Paste X-Tapis-Token value"
                  style={{
                    width: '100%',
                    padding: '6px',
                    marginTop: '3px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSetAccessToken}
                  style={{
                    padding: '8px',
                    backgroundColor: '#673ab7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    flex: 1,
                  }}
                >
                  Store Access Token
                </button>
                <button
                  onClick={handleClearAccessToken}
                  style={{
                    padding: '8px',
                    backgroundColor: '#9e9e9e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    flex: 1,
                  }}
                >
                  Clear Token
                </button>
              </div>
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#555' }}>
                Status: {hasStoredToken ? 'Token stored in sessionStorage' : 'No token stored'}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default DevTapisAuthHelper;
