import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import { createRoot } from 'react-dom/client';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

// Debug: intercept fetch calls and log any requests to the CKAN organizations
// endpoint so we can see the full outgoing request (method, headers, body).
// Keep this in dev only; remove or gate behind an env var for production.
if (typeof window !== 'undefined') {
  try {
    // Preserve original
    const _originalFetch = window.fetch.bind(window);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - augment window.fetch for debug logging
    window.fetch = async (input: RequestInfo, init?: RequestInit) => {
      try {
        const url = typeof input === 'string' ? input : input.url;
        const target = '/api/v1/ckan/organizations';
        if (url && url.includes(target)) {
          // Clone headers into a plain object for logging
          const headersObj: Record<string, string> = {};
          const hdrs = init?.headers ?? (typeof input !== 'string' ? (input as Request).headers : undefined);
          if (hdrs instanceof Headers) {
            hdrs.forEach((v, k) => (headersObj[k] = v));
          } else if (typeof hdrs === 'object' && hdrs !== null) {
            Object.entries(hdrs as Record<string, string>).forEach(([k, v]) => (headersObj[k] = String(v)));
          }

          // Attempt to stringify body if present
          let bodyPreview: string | undefined = undefined;
          if (init?.body) {
            try {
              bodyPreview = typeof init.body === 'string' ? init.body : JSON.stringify(init.body);
            } catch {
              bodyPreview = String(init.body);
            }
          }

          console.group('[DEBUG][CKAN] Outgoing request to organizations');
          console.log('URL:', url);
          console.log('Method:', init?.method ?? (typeof input !== 'string' ? (input as Request).method : 'GET'));
          console.log('Headers:', headersObj);
          if (bodyPreview) console.log('Body:', bodyPreview);
          console.groupEnd();
        }
      } catch (e) {
        console.warn('[DEBUG][CKAN] Failed to log request', e);
      }
      return _originalFetch(input, init);
    };
  } catch (e) {
    // ignore if fetch cannot be wrapped
    console.warn('[DEBUG][CKAN] Could not install fetch wrapper', e);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </StrictMode>,
);
