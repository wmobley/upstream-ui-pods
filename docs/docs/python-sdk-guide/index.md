# Python SDK Guide

The `upstream-sdk` Python package provides a high-level client for working with Upstream data from notebooks, scripts, and automated pipelines.

## What the SDK provides

- **UpstreamClient** — main entry point with authentication and all managers
- **CampaignManager** — list, create, update, delete, publish campaigns
- **StationManager** — list, create, update, delete, publish, export stations
- **SensorManager** — list, get, update, delete, publish sensors
- **MeasurementManager** — list, create, update, delete measurements; get GeoJSON and confidence intervals
- **DataUploader** — validate and upload CSV files with chunking support
- **CKANIntegration** — create, update, delete CKAN datasets and resources
- **UserRoleManager** — manage user roles (admin only)
- **MetadataSchemaManager** — manage custom metadata schema fields
- **SensorVariableManager** — list available sensor variables
- **NoteManager** — create and manage notes at campaign, station, sensor, and measurement scopes
- **PodsManager** — create pod bundles

## Quick start

```python
from upstream_sdk import UpstreamClient

# Initialize the client
client = UpstreamClient(
    base_url="https://upstreamapi.pods.portals.tapis.io",
    username="your-username",
    password="your-password",
)

# List campaigns
campaigns = client.campaigns.list()
for campaign in campaigns.items:
    print(f"{campaign.name} — {campaign.description}")
```

## Guides

| Topic | Page |
| --- | --- |
| Installation | [Installation](installation.md) |
| Authentication | [Authentication](authentication.md) |
| Configuration | [Configuration](configuration.md) |
| Campaign workflows | [Campaign management](core-workflows/campaign-management.md) |
| Station workflows | [Station management](core-workflows/station-management.md) |
| Sensor workflows | [Sensor management](core-workflows/sensor-management.md) |
| Measurement workflows | [Measurement operations](core-workflows/measurement-operations.md) |
| Data upload | [Data upload](core-workflows/data-upload.md) |
| CKAN publishing | [CKAN publishing](advanced-workflows/ckan-publishing.md) |
| Geospatial analysis | [Geospatial analysis](advanced-workflows/geospatial-analysis.md) |
| Statistical analysis | [Statistical analysis](advanced-workflows/statistical-analysis.md) |
| Automation examples | [Automation examples](advanced-workflows/automation-examples.md) |
| Metadata schemas | [Metadata schemas](advanced-workflows/metadata-schemas.md) |
| Troubleshooting | [Troubleshooting](troubleshooting.md) |

## Examples

Runnable example scripts are available in the [examples](examples/index.md) directory:

- [basic-workflow.py](examples/basic-workflow.py) — create campaign, station, upload, and query
- [csv-upload-large.py](examples/csv-upload-large.py) — upload large CSV files with chunking
- [ckan-publish-full.py](examples/ckan-publish-full.py) — full CKAN publishing workflow
- [geojson-export.py](examples/geojson-export.py) — export measurements as GeoJSON
- [confidence-intervals.py](examples/confidence-intervals.py) — retrieve and plot confidence intervals
- [batch-campaign-setup.py](examples/batch-campaign-setup.py) — set up multiple campaigns programmatically
