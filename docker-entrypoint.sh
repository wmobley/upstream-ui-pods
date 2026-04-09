#!/bin/sh
set -eu

CONFIG_PATH="/usr/share/nginx/html/runtime-config.js"
RELEASE_HEADER_INCLUDE="/etc/nginx/conf.d/release-header.inc"
UPSTREAM_RELEASE_VALUE="${UPSTREAM_RELEASE:-${IMAGE_TAG:-${HOSTNAME:-unknown}}}"

printf 'add_header X-Upstream-Release "%s" always;\n' "$UPSTREAM_RELEASE_VALUE" > "$RELEASE_HEADER_INCLUDE"

if [ -n "${VITE_UPSTREAM_API_URL:-}" ] || [ -n "${VITE_CKAN_URL:-}" ] || \
   [ -n "${VITE_TAPIS_BASE_URL:-}" ] || [ -n "${VITE_TAPIS_PODS_BASE_URL:-}" ]; then
  {
    echo 'window.__UPSTREAM_CONFIG__ = window.__UPSTREAM_CONFIG__ || {};'
    if [ -n "${VITE_UPSTREAM_API_URL:-}" ]; then
      echo "window.__UPSTREAM_CONFIG__.VITE_UPSTREAM_API_URL = \"${VITE_UPSTREAM_API_URL}\";"
    fi
    if [ -n "${VITE_CKAN_URL:-}" ]; then
      echo "window.__UPSTREAM_CONFIG__.VITE_CKAN_URL = \"${VITE_CKAN_URL}\";"
    fi
    if [ -n "${VITE_TAPIS_BASE_URL:-}" ]; then
      echo "window.__UPSTREAM_CONFIG__.VITE_TAPIS_BASE_URL = \"${VITE_TAPIS_BASE_URL}\";"
    fi
    if [ -n "${VITE_TAPIS_PODS_BASE_URL:-}" ]; then
      echo "window.__UPSTREAM_CONFIG__.VITE_TAPIS_PODS_BASE_URL = \"${VITE_TAPIS_PODS_BASE_URL}\";"
    fi
  } > "$CONFIG_PATH"
fi

exec "$@"
