# Upstream Viz

A modern visualization platform for environmental sensor data. This application provides powerful tools for analyzing, visualizing, and exploring time-series data from environmental monitoring campaigns.

## Features

- **Multiple Visualization Types**:

  - Heat maps for spatial distribution of sensor readings
  - Time series charts with confidence intervals
  - Scatter plots for temporal data analysis
  - Interactive maps for geographic data exploration

- **Hierarchical Data Organization**:

  - Campaigns → Stations → Sensors → Measurements
  - Comprehensive filtering and search capabilities

- **Interactive UI**:

  - Built with React and TypeScript
  - Responsive design using Tailwind CSS
  - D3.js-powered visualizations

- **Data Analysis Tools**:
  - Statistical summaries and aggregations
  - Flexible time range selection
  - Data export capabilities

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Visualization**: D3.js, Leaflet
- **Routing**: React Router
- **Bundling**: Vite
- **API Integration**: Generated TypeScript client from OpenAPI specification
- **Python SDK**: [upstream-sdk](../upstream-sdk/) - High-level Python interface for researchers
- **Data Publishing**: CKAN integration via upstream-sdk for data discoverability

## Ecosystem Integration

The upstream-ui is part of a comprehensive environmental data platform ecosystem:

- **[upstream-ui](.)** - Interactive web visualization platform (this repository)
- **[upstream-sdk](../upstream-sdk/)** - Python SDK for programmatic data management and research automation
- **[upstream-docker](../upstream-docker/)** - FastAPI backend services and infrastructure
- **CKAN Data Portal** - Public data discovery and sharing platform

### Multi-Interface Access

The platform supports multiple user interfaces:

1. **Web Interface** (`upstream-ui`): Interactive visualization, data exploration, and real-time monitoring
2. **Python SDK** (`upstream-sdk`): Programmatic access for researchers, automated data pipelines, and CKAN publishing
3. **Direct API**: RESTful API access for custom integrations

Both the web interface and Python SDK consume the same underlying FastAPI backend, ensuring data consistency and feature parity.

## Architecture

### Conceptual Overview

```mermaid
graph TB
    subgraph "Web Client Application"
        WebUser[Web User] --> Auth[Authentication Layer]
        Auth --> Router[React Router]

        Router --> Campaign[Campaign Views]
        Router --> Station[Station Views]
        Router --> Sensor[Sensor Views]
        Router --> Common[Common Components]

        Campaign --> CampaignHooks[Campaign Hooks]
        Station --> StationHooks[Station Hooks]
        Sensor --> SensorHooks[Sensor Hooks]

        CampaignHooks --> ReactQuery[React Query]
        StationHooks --> ReactQuery
        SensorHooks --> ReactQuery

        ReactQuery --> APIClient[Generated TS API Client<br/>OpenAPI Spec]

        Campaign --> VizComponents[Visualization Components]
        Station --> VizComponents
        Sensor --> VizComponents

        VizComponents --> HeatMap[Heat Map<br/>D3.js]
        VizComponents --> LineChart[Line Confidence Chart<br/>D3.js]
        VizComponents --> ScatterPlot[Scatter Time Series<br/>D3.js]
        VizComponents --> GeometryMap[Geometry Map<br/>Leaflet]

        Auth --> AuthContext[Auth Context]
        AuthContext --> LocalStorage[(Local Storage)]

        Common --> DataProcessing[Data Processing Utils<br/>LTTB Algorithm]
        DataProcessing --> VizComponents
    end

    subgraph "Python SDK Ecosystem"
        PythonUser[Python Researcher] --> PythonSDK[upstream-sdk<br/>Python SDK]

        PythonSDK --> AuthManager[Auth Manager]
        PythonSDK --> CampaignMgr[Campaign Manager]
        PythonSDK --> StationMgr[Station Manager]
        PythonSDK --> SensorMgr[Sensor Manager]
        PythonSDK --> MeasurementMgr[Measurement Manager]
        PythonSDK --> DataUploader[Data Uploader]
        PythonSDK --> CKANIntegration[CKAN Integration]

        AuthManager --> PythonAPIClient[upstream-python-api-client<br/>OpenAPI Generated]
        CampaignMgr --> PythonAPIClient
        StationMgr --> PythonAPIClient
        SensorMgr --> PythonAPIClient
        MeasurementMgr --> PythonAPIClient
        DataUploader --> PythonAPIClient
    end

    APIClient --> BackendAPI[upstream-docker<br/>FastAPI Backend]
    PythonAPIClient --> BackendAPI
    CKANIntegration --> CKANPortal[CKAN Data Portal<br/>Tapis/TACC]

    subgraph "Backend Services"
        BackendAPI --> FastAPI[FastAPI Application<br/>CORS Middleware]
        FastAPI --> APIRouter[API Router v1]
        APIRouter --> CampaignAPI[Campaign Routes]
        APIRouter --> StationAPI[Station Routes]
        APIRouter --> SensorAPI[Sensor Routes]
        APIRouter --> MeasurementAPI[Measurement Routes]
        APIRouter --> UploadAPI[CSV Upload Routes]

        CampaignAPI --> Repositories[Data Repositories]
        StationAPI --> Repositories
        SensorAPI --> Repositories
        MeasurementAPI --> Repositories
        UploadAPI --> Repositories

        Repositories --> Database[(PostgreSQL + PostGIS)]
        Repositories --> LTTBAlgo[LTTB Downsampling]
    end

    style WebUser fill:#e1f5fe
    style PythonUser fill:#e1f5fe
    style Auth fill:#fff3e0
    style ReactQuery fill:#f3e5f5
    style APIClient fill:#e8f5e8
    style PythonSDK fill:#e8f5e8
    style CKANPortal fill:#fff3e0
    style VizComponents fill:#fce4ec
    style BackendAPI fill:#e8f5e8
    style Database fill:#fff9c4
```

### Architecture Components

The following diagrams break down each major component of the system architecture for easier understanding:

#### Web Client Application

```mermaid
graph TB
    WebUser[Web User] --> Auth[Authentication Layer]
    Auth --> Router[React Router]

    Router --> Campaign[Campaign Views]
    Router --> Station[Station Views]
    Router --> Sensor[Sensor Views]
    Router --> Common[Common Components]

    Campaign --> CampaignHooks[Campaign Hooks]
    Station --> StationHooks[Station Hooks]
    Sensor --> SensorHooks[Sensor Hooks]

    CampaignHooks --> ReactQuery[React Query]
    StationHooks --> ReactQuery
    SensorHooks --> ReactQuery

    ReactQuery --> APIClient[Generated TS API Client<br/>OpenAPI Spec]

    Campaign --> VizComponents[Visualization Components]
    Station --> VizComponents
    Sensor --> VizComponents

    VizComponents --> HeatMap[Heat Map<br/>D3.js]
    VizComponents --> LineChart[Line Confidence Chart<br/>D3.js]
    VizComponents --> ScatterPlot[Scatter Time Series<br/>D3.js]
    VizComponents --> GeometryMap[Geometry Map<br/>Leaflet]

    Auth --> AuthContext[Auth Context]
    AuthContext --> LocalStorage[(Local Storage)]

    Common --> DataProcessing[Data Processing Utils<br/>LTTB Algorithm]
    DataProcessing --> VizComponents

    style WebUser fill:#e1f5fe
    style Auth fill:#fff3e0
    style ReactQuery fill:#f3e5f5
    style APIClient fill:#e8f5e8
    style VizComponents fill:#fce4ec
```

#### Python SDK Ecosystem

```mermaid
graph TB
    PythonUser[Python Researcher] --> PythonSDK[upstream-sdk<br/>Python SDK]

    PythonSDK --> AuthManager[Auth Manager]
    PythonSDK --> CampaignMgr[Campaign Manager]
    PythonSDK --> StationMgr[Station Manager]
    PythonSDK --> SensorMgr[Sensor Manager]
    PythonSDK --> MeasurementMgr[Measurement Manager]
    PythonSDK --> DataUploader[Data Uploader]
    PythonSDK --> CKANIntegration[CKAN Integration]

    AuthManager --> PythonAPIClient[upstream-python-api-client<br/>OpenAPI Generated]
    CampaignMgr --> PythonAPIClient
    StationMgr --> PythonAPIClient
    SensorMgr --> PythonAPIClient
    MeasurementMgr --> PythonAPIClient
    DataUploader --> PythonAPIClient

    CKANIntegration --> CKANPortal[CKAN Data Portal<br/>Tapis/TACC]

    CSVFiles[CSV Files<br/>Sensors & Measurements] --> DataUploader

    style PythonUser fill:#e1f5fe
    style PythonSDK fill:#e8f5e8
    style PythonAPIClient fill:#e8f5e8
    style CKANPortal fill:#fff3e0
```

#### Backend Services

```mermaid
graph TB
    APIClient[Generated TS API Client] --> BackendAPI[upstream-docker<br/>FastAPI Backend]
    PythonAPIClient[upstream-python-api-client] --> BackendAPI

    BackendAPI --> FastAPI[FastAPI Application<br/>CORS Middleware]
    FastAPI --> APIRouter[API Router v1]
    APIRouter --> CampaignAPI[Campaign Routes]
    APIRouter --> StationAPI[Station Routes]
    APIRouter --> SensorAPI[Sensor Routes]
    APIRouter --> MeasurementAPI[Measurement Routes]
    APIRouter --> UploadAPI[CSV Upload Routes]

    CampaignAPI --> Repositories[Data Repositories]
    StationAPI --> Repositories
    SensorAPI --> Repositories
    MeasurementAPI --> Repositories
    UploadAPI --> Repositories

    Repositories --> Database[(PostgreSQL + PostGIS)]
    Repositories --> LTTBAlgo[LTTB Downsampling]

    subgraph "Data Hierarchy"
        Campaigns --> Stations
        Stations --> Sensors
        Sensors --> Measurements
    end

    style APIClient fill:#e8f5e8
    style PythonAPIClient fill:#e8f5e8
    style BackendAPI fill:#e8f5e8
    style Database fill:#fff9c4
```

### Data Flow Architecture

```mermaid
graph LR
    subgraph "upstream-docker Backend"
        Database[(PostgreSQL + PostGIS)]
        FastAPIApp[FastAPI Application<br/>OpenAPI Schema Generation]
        APIRoutes[API Routes<br/>v1/campaigns, v1/stations<br/>v1/sensors, v1/measurements]
        DataRepos[Data Repositories<br/>Campaign, Station<br/>Sensor, Measurement]
        BackendLTTB[Backend LTTB<br/>Downsampling]
        CSVUpload[CSV Upload Handler]

        Database --> DataRepos
        DataRepos --> APIRoutes
        APIRoutes --> FastAPIApp
        DataRepos --> BackendLTTB
        CSVUpload --> DataRepos
    end

    subgraph "External Services"
        CKANPortal[CKAN Data Portal<br/>Tapis/TACC Infrastructure]
    end

    subgraph "Data Hierarchy"
        Campaigns --> Stations
        Stations --> Sensors
        Sensors --> Measurements
    end

    subgraph "Python SDK Data Flow"
        PythonResearcher[Python Researcher]
        SDKClient[UpstreamClient<br/>High-level SDK Interface]

        subgraph "SDK Components"
            AuthMgr[AuthManager<br/>Token Management]
            CampMgr[CampaignManager<br/>CRUD Operations]
            StationMgr[StationManager<br/>Station Management]
            SensorMgr[SensorManager<br/>Sensor & Statistics]
            MeasMgr[MeasurementManager<br/>Data Retrieval]
            DataUp[DataUploader<br/>CSV Processing]
            CKANInt[CKANIntegration<br/>Publishing & Metadata]
        end

        PythonAPIClient[upstream-python-api-client<br/>Generated from OpenAPI]
        CSVFiles[CSV Files<br/>Sensors & Measurements]

        PythonResearcher --> SDKClient
        SDKClient --> AuthMgr
        SDKClient --> CampMgr
        SDKClient --> StationMgr
        SDKClient --> SensorMgr
        SDKClient --> MeasMgr
        SDKClient --> DataUp
        SDKClient --> CKANInt

        AuthMgr --> PythonAPIClient
        CampMgr --> PythonAPIClient
        StationMgr --> PythonAPIClient
        SensorMgr --> PythonAPIClient
        MeasMgr --> PythonAPIClient
        DataUp --> PythonAPIClient

        CSVFiles --> DataUp
        CKANInt --> CKANPortal
    end

    subgraph "Web UI Data Flow"
        WebUser[Web User]
        AuthContext[Auth Context<br/>localStorage]
        ReactQuery[React Query<br/>Server State Cache]
        LocalState[Local Component State<br/>UI Interactions]

        LTTB[Frontend LTTB<br/>Downsampling]
        TimeAgg[Time Aggregation]
        Resolution[Auto Resolution]

        GeneratedTS[Generated TS Client<br/>OpenAPI Spec]
        Config[API Configuration<br/>Auth Headers]

        WebUser --> AuthContext
        AuthContext --> Config
        Config --> GeneratedTS
        GeneratedTS --> ReactQuery
        ReactQuery --> LocalState
        LocalState --> LTTB
        LTTB --> TimeAgg
        TimeAgg --> Resolution
    end

    FastAPIApp --> GeneratedTS
    FastAPIApp --> PythonAPIClient

    Measurements --> ReactQuery
    Measurements --> MeasMgr

    Resolution --> Visualizations[Chart Components<br/>D3.js & Leaflet]

    style AuthContext fill:#fff3e0
    style ReactQuery fill:#f3e5f5
    style GeneratedTS fill:#e8f5e8
    style PythonAPIClient fill:#e8f5e8
    style SDKClient fill:#e8f5e8
    style CKANPortal fill:#fff3e0
    style LTTB fill:#e1f5fe
    style Database fill:#fff9c4
    style FastAPIApp fill:#e8f5e8
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/upstream-viz.git
   cd upstream-viz
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the API client (required before first run):

   ```bash
   cd packages/upstream-api && npm run build && cd ../..
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### Project Structure

```
src/
├── app/                  # Main application components
│   ├── Campaign/         # Campaign-related views
│   ├── Station/          # Station-related views
│   ├── Sensor/           # Sensor-related views
│   ├── common/           # Shared components
│   ├── HeatMap/          # Heat map visualization
│   ├── LineConfidenceChart/ # Line chart with confidence intervals
│   ├── RouterMap/        # Map-based visualizations
│   ├── TimeSeriesGraph/  # Time series visualization
│   └── ...
├── assets/               # Static assets
├── components/           # Generic UI components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── providers/            # Provider components
└── utils/                # Utility functions
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run linter
- `npm run preview` - Preview production build

## Deployment

The application can be deployed as a static site or using Docker:

```bash
# Build for production
npm run build

# Using Docker
docker build -t upstream-viz .
docker run -p 8080:80 upstream-viz
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
