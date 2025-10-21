#!/bin/sh
set -eu

CONFIG_PATH="/usr/share/nginx/html/runtime-config.js"

if [ -n "${VITE_UPSTREAM_API_URL:-}" ] || [ -n "${VITE_CKAN_URL:-}" ]; then
  {
    echo 'window.__UPSTREAM_CONFIG__ = window.__UPSTREAM_CONFIG__ || {};'
    if [ -n "${VITE_UPSTREAM_API_URL:-}" ]; then
      echo "window.__UPSTREAM_CONFIG__.VITE_UPSTREAM_API_URL = \"${VITE_UPSTREAM_API_URL}\";"
    fi
    if [ -n "${VITE_CKAN_URL:-}" ]; then
      echo "window.__UPSTREAM_CONFIG__.VITE_CKAN_URL = \"${VITE_CKAN_URL}\";"
    fi
  } > "$CONFIG_PATH"
fi

exec "$@"
