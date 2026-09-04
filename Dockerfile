# Build stage — React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Docs build stage — MkDocs + Pagefind
FROM python:3.12-slim AS docs

WORKDIR /docs

# Install Node/npm for npx pagefind, then Python docs dependencies.
RUN apt-get update \
    && apt-get install -y --no-install-recommends nodejs npm \
    && rm -rf /var/lib/apt/lists/*

COPY docs/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy MkDocs source
COPY docs/ ./mkdocs-source/

# Build the MkDocs site, then run Pagefind for static search
RUN mkdocs build --config-file mkdocs-source/mkdocs.yml --site-dir /docs/site \
    && cd /docs/site \
    && npx -y pagefind --site .

# Production stage
FROM nginx:1.30.2

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy built docs site
COPY --from=docs /docs/site /usr/share/nginx/html/docs

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy nginx configuration to ensure SPA routes are routed to index.html
# This enables direct navigation to client-side routes (e.g. /campaigns/new)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
