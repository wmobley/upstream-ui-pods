import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { ServerOptions } from 'node:https';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd());

  // Allow the value to come from either .env files or the Node process env
  const upstreamApiUrl =
    env.VITE_UPSTREAM_API_URL ?? process.env.VITE_UPSTREAM_API_URL;

  if (upstreamApiUrl) {
    // Ensure downstream tooling sees the resolved value
    process.env.VITE_UPSTREAM_API_URL = upstreamApiUrl;
  } else {
    console.warn(
      'VITE_UPSTREAM_API_URL was not provided; runtime-config.js must define it before the app loads.',
    );
  }

  // Local HTTPS dev server: enable with VITE_HTTPS=true. Certificates default
  // to mkcert's ~/.mkcert/localhost.{pem,key} so the Tapis OAuth callback
  // (https://localhost:3000/callback) works locally; Tapis requires https
  // redirect URIs. Override the paths with VITE_TLS_CERT / VITE_TLS_KEY.
  const useHttps = env.VITE_HTTPS === 'true' || process.env.VITE_HTTPS === 'true';
  let serverHttps: ServerOptions | undefined;
  if (useHttps) {
    const certPath = env.VITE_TLS_CERT ?? path.join(os.homedir(), '.mkcert', 'localhost.pem');
    const keyPath = env.VITE_TLS_KEY ?? path.join(os.homedir(), '.mkcert', 'localhost-key.pem');
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      serverHttps = {
        cert: fs.readFileSync(certPath).toString(),
        key: fs.readFileSync(keyPath).toString(),
      };
    } else {
      console.warn(
        `VITE_HTTPS=true but certs not found (${certPath}, ${keyPath}); falling back to http. Run: mkcert -install && mkcert -key-file ~/.mkcert/localhost-key.pem -cert-file ~/.mkcert/localhost.pem localhost 127.0.0.1`,
      );
    }
  }

  return {
    resolve: {
      alias: {
        src: '/src',
      },
    },
    plugins: [react()],
    server: {
      port: 3000,
      https: serverHttps,
    },
  };
});
