import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd());

  // Validate required environment variables
  if (!env.VITE_OAUTH_CLIENT_ID) {
    throw new Error(
      'VITE_OAUTH_CLIENT_ID is required in environment variables',
    );
  }

  if (!env.VITE_TAPIS_LOGIN_URL) {
    throw new Error(
      'VITE_TAPIS_LOGIN_URL is required in environment variables',
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
