# Automation Examples

Common automation patterns using the Python SDK.

## Automated data pipeline

```python
from upstream_sdk import UpstreamClient
from pathlib import Path

client = UpstreamClient.from_environment()

# Define campaign and station
campaign_id = 123
station_id = 456

# Upload new data
sensors_file = Path("data/sensors.csv")
measurements_file = Path("data/measurements.csv")

if sensors_file.exists() and measurements_file.exists():
    result = client.upload_csv_data(
        campaign_id=campaign_id,
        station_id=station_id,
        sensors_file=str(sensors_file),
        measurements_file=str(measurements_file),
    )
    print(f"Upload complete: {result['message']}")
```

## Batch campaign creation

```python
from upstream_sdk import UpstreamClient
from upstream_api_client.models import CampaignsIn, StationCreate

client = UpstreamClient.from_environment()

# Create multiple campaigns
campaigns = [
    {"name": "Campaign Alpha", "description": "First campaign"},
    {"name": "Campaign Beta", "description": "Second campaign"},
    {"name": "Campaign Gamma", "description": "Third campaign"},
]

for campaign_data in campaigns:
    campaign_in = CampaignsIn(**campaign_data)
    campaign = client.campaigns.create(campaign_in)
    print(f"Created campaign: {campaign.id} — {campaign.name}")
```

## Automated publishing

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient.from_environment()

# Publish all stations in a campaign
campaign = client.campaigns.get(campaign_id=123)

for station in campaign.stations:
    try:
        result = client.publish_station(
            campaign_id=123,
            station_id=station.id,
            organization="upstream",
        )
        print(f"Published station {station.name}: {result}")
    except Exception as e:
        print(f"Failed to publish {station.name}: {e}")
```

## Scheduled data export

```python
from upstream_sdk import UpstreamClient
from datetime import datetime, timedelta

client = UpstreamClient.from_environment()

# Export last 7 days of data
end_date = datetime.now()
start_date = end_date - timedelta(days=7)

measurements_csv = client.export_measurements_csv(
    campaign_id=123,
    station_id=456,
    start_date=start_date.isoformat(),
    end_date=end_date.isoformat(),
)

# Save to file
filename = f"export_{end_date.strftime('%Y%m%d')}.csv"
with open(filename, "w") as f:
    f.write(measurements_csv)
print(f"Exported to {filename}")
```

## Monitoring station health

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient.from_environment()

# Check measurement counts
campaign = client.campaigns.get(campaign_id=123)

for station in campaign.stations:
    sensors = client.sensors.list(campaign_id=123, station_id=station.id)
    
    for sensor in sensors.items:
        stats = client.sensors.get(
            sensor_id=sensor.id,
            station_id=station.id,
            campaign_id=123,
        )
        
        if stats.measurement_count == 0:
            print(f"WARNING: {station.name} / {sensor.alias} has no measurements")
```
