import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { createRoot } from 'react-dom/client';
import { TapisProvider } from '@tapis/tapisui-hooks';
import { resolveBasePath } from './utils/resolveBasePath.ts';

// Load environment variables
const config = {
  oauthClientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
};

// Validate required configuration
if (!config.oauthClientId) {
  throw new Error('VITE_OAUTH_CLIENT_ID is required in environment variables');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TapisProvider basePath={resolveBasePath()}>
      <Router>
        <App />
      </Router>
    </TapisProvider>
  </StrictMode>,
);
