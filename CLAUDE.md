# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Upstream Viz is a React-based environmental sensor data visualization platform with a hierarchical data model: Campaigns → Stations → Sensors → Measurements. The application provides multiple visualization types including heat maps, time series charts with confidence intervals, scatter plots, and interactive maps.

## Development Commands

### Building and Running
- `npm install` - Install dependencies
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (includes API client build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### API Client Management
- `cd packages/upstream-api && npm run build && cd ../..` - Build the API client (required before first run)
- `./update-upstream-api-client.sh <openapi.json>` - Regenerate API client from OpenAPI spec

### Environment Setup
- Requires `VITE_UPSTREAM_API_URL` environment variable
- Authentication uses localStorage for access tokens

## Architecture

### Core Structure
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Routing**: React Router v5 with protected routes
- **Visualization**: D3.js for charts, Leaflet for maps
- **API**: Generated TypeScript client from OpenAPI spec
- **Build**: Vite with TypeScript compilation

### Key Directories
- `src/app/` - Main application components organized by feature (Campaign, Station, Sensor, etc.)
- `src/app/common/` - Shared UI components and utilities
- `src/hooks/` - Custom React hooks organized by domain (api, auth, campaign, etc.)
- `src/contexts/` - React contexts (primarily AuthContext)
- `src/utils/` - Utility functions including data processing algorithms
- `packages/upstream-api/` - Generated API client package

### Data Flow
- Authentication managed via AuthContext with localStorage persistence
- API configuration hook (`useConfiguration`) handles auth headers and base URL
- Custom hooks in `src/hooks/` provide domain-specific data fetching
- Data processing utilities in `src/utils/dataProcessing.ts` implement LTTB algorithm for chart optimization

### Visualization Components
- `LineConfidenceChart/` - Time series with confidence intervals (D3 + React)
- `ScatterTimeSeriesChart/` - Scatter plot visualization
- `HeatMap/` - Spatial heat map visualization
- `GeometryMap/` - Leaflet-based mapping components

### State Management
- React Query (`@tanstack/react-query`) for server state
- React Context for authentication state
- Local component state for UI interactions

## API Integration

The project uses a generated TypeScript client (`@upstream/upstream-api`) that must be built before the main application. The API client is generated from OpenAPI specifications using `openapi-generator-cli`.

## Data Processing

The application implements sophisticated data processing including:
- Largest-Triangle-Three-Buckets (LTTB) algorithm for time series downsampling
- Time-based aggregation with configurable intervals
- Automatic resolution determination based on time ranges

## Testing and Linting

- ESLint configuration with React hooks and TypeScript rules
- No test framework currently configured in package.json