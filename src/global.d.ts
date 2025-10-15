export {};

declare global {
  interface Window {
    __UPSTREAM_CONFIG__?: {
      VITE_UPSTREAM_API_URL?: string;
    };
  }
}
