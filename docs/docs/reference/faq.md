# Frequently Asked Questions

## General

### What is Upstream?

Upstream is an environmental sensor data platform for collecting, managing, visualizing, and publishing sensor data. It supports campaigns, stations, sensors, and measurements in a hierarchical data model.

### Who uses Upstream?

Environmental researchers, field data managers, and project administrators who collect and manage sensor data.

### What interfaces are available?

- **Web UI** — interactive browser-based interface
- **Python SDK** — programmatic access from notebooks and scripts
- **REST API** — direct HTTP access for custom integrations

## Data upload

### What CSV formats are supported?

Two CSV files are required:

1. **Sensors CSV** — defines sensor aliases, variable names, and units
2. **Measurements CSV** — contains timestamps, coordinates, and measurement values

See [Data Preparation](../data-preparation/index.md) for format details.

### What is the maximum file size?

Files up to 500 MB are supported. Large files are automatically chunked during upload.

### How are naive timestamps handled?

Timestamps without timezone information are interpreted using the station's declared timezone.

## Visualization

### What chart types are available?

- Line chart with confidence intervals
- Scatter plot
- Heat map (spatial)
- Geometry/route map (spatial)

### How does downsampling work?

The LTTB algorithm reduces displayed points while preserving visual shape. All data remains in the database.

## Publishing

### What is CKAN?

CKAN is an open-source data management system used for publishing and discovering datasets.

### What gets published?

Published stations include a CKAN dataset with sensors CSV and measurements CSV as resources, plus metadata extras.

### Can I unpublish data?

Yes. Use the unpublish action in the UI, SDK, or API to remove data from CKAN.

## Authentication

### How do I authenticate?

- **Web UI**: Sign in with Tapis
- **SDK**: Provide username and password
- **API**: Pass a Tapis access token in the Authorization header

### What roles are available?

- **Regular user** — view, manage own data, upload, export, publish
- **Admin** — all regular capabilities plus user management, metadata schemas, pod bundles

## Troubleshooting

### I get a 401 error

Your token is expired or invalid. Re-authenticate to obtain a new token.

### My upload fails validation

Check that:

- Required columns are present
- Sensor aliases match between files
- Coordinates are in valid ranges
- Timestamps are in ISO 8601 format
- File encoding is UTF-8

### My published data is not visible in CKAN

Check that:

- The dataset is not private
- You have permission to view the organization's datasets
- The CKAN portal is not caching results
