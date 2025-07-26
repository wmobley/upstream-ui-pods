#!/bin/bash

# This script updates the upstream API client with the latest changes from the main branch

set -e

OPEN_API_SPEC_FILE=$1
if [ -z "$OPEN_API_SPEC_FILE" ]; then
  echo "Usage: $0 <open_api_spec_file>"
  exit 1
fi

openapi-generator-cli generate \
  -i "$OPEN_API_SPEC_FILE" \
  -g typescript-fetch \
  -o packages/upstream-api