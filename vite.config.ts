import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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

  return {
    resolve: {
      alias: {
        src: '/src',
      },
    },
    plugins: [react()],
  };
});
