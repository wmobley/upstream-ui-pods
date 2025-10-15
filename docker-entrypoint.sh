#!/bin/sh
set -eu

CONFIG_PATH="/usr/share/nginx/html/runtime-config.js"

if [ -n "${VITE_UPSTREAM_API_URL:-}" ]; then
  cat <<EOF > "$CONFIG_PATH"
window.__UPSTREAM_CONFIG__ = window.__UPSTREAM_CONFIG__ || {};
window.__UPSTREAM_CONFIG__.VITE_UPSTREAM_API_URL = "${VITE_UPSTREAM_API_URL}";
EOF
fi

exec "$@"
