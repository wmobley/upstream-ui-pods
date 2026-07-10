export {};

declare global {
  interface Window {
    __UPSTREAM_CONFIG__?: {
      VITE_UPSTREAM_API_URL?: string;
      VITE_CKAN_URL?: string;
      VITE_TAPIS_PODS_BASE_URL?: string;
      VITE_TAPIS_BASE_URL?: string;
      VITE_TAPIS_POD_ID?: string;
      VITE_TAPIS_ACCESS_TOKEN?: string;
      VITE_TAPIS_TENANT?: string;
      VITE_TAPIS_SITE?: string;
      VITE_TAPIS_OAUTH_CLIENT_ID?: string;
      VITE_TAPIS_OAUTH_CLIENT_KEY?: string;
    };
  }
}
