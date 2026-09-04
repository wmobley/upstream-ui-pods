# Python SDK Quickstart

This guide shows how to authenticate, list campaigns, and work with Upstream data using the `upstream-sdk` Python package.

## Prerequisites

- Python 3.9+
- A Tapis account with access to an Upstream deployment
- Your project’s Upstream API base URL. You can find this from the project selector and API docs link in the web UI.

## Installation

```bash
pip install upstream-sdk
```

## Authentication

The SDK authenticates using Tapis OAuth2. You need your Tapis credentials (username, password, or token).

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient(
    base_url="https://upstreamapi.pods.portals.tapis.io",
    username="your-username",
    password="your-password",
)
```

If you are working in a project-specific instance, replace `base_url` with that project’s API URL. See [Projects and API URLs](../concepts/projects-and-api-urls.md) for how to find it.

!!! note "Token management"
    The SDK handles token refresh automatically. For long-running scripts, you can pass an existing token instead of credentials.

## List campaigns

```python
campaigns = client.campaigns.list()

for campaign in campaigns:
    print(f"{campaign.name} — {campaign.description}")
```

## Get a campaign with stations

```python
campaign = client.campaigns.get(campaign_id="your-campaign-id")

for station in campaign.stations:
    print(f"  Station: {station.name} — {station.timezone}")
```

## Retrieve measurements

```python
from datetime import datetime

measurements = client.measurements.list(
    station_id="your-station-id",
    start=datetime(2025, 6, 1),
    end=datetime(2025, 6, 30),
)

for m in measurements:
    print(f"{m.collection_time} — {m.values}")
```

## Upload CSV data

```python
client.data_uploader.upload(
    station_id="your-station-id",
    sensors_file="sensors.csv",
    measurements_file="measurements.csv",
)
```

## Export as GeoJSON

```python
geojson = client.measurements.export_geojson(
    station_id="your-station-id",
    start=datetime(2025, 6, 1),
    end=datetime(2025, 6, 30),
)

with open("export.geojson", "w") as f:
    f.write(geojson)
```

## Publish to CKAN

```python
client.ckan.publish(
    campaign_id="your-campaign-id",
    title="My Campaign Data",
    notes="Field observations from the June 2025 IOP",
)
```

## Next steps

- See the full [SDK workflows](../python-sdk-guide/index.md) for campaign, station, sensor, and measurement operations.
- Explore [CKAN publishing](../ckan-integration/index.md) for dataset structure and metadata mapping.
- Check the [API quickstart](quickstart-api.md) if you prefer direct HTTP access.
