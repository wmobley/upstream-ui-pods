# Station Management

The SDK provides station lifecycle management through the `StationManager`.

## Listing stations

```python
stations = client.stations.list(campaign_id=123, limit=100)

for station in stations.items:
    print(f"{station.id}: {station.name} (tz: {station.timezone})")
```

## Getting a station

```python
station = client.stations.get(station_id=456, campaign_id=123)

print(f"Name: {station.name}")
print(f"Timezone: {station.timezone}")
print(f"Location: {station.latitude}, {station.longitude}")
print(f"Sensors: {len(station.sensors)}")
```

## Creating a station

```python
from upstream_api_client.models import StationCreate

station_data = StationCreate(
    name="Weather Station Alpha",
    description="Automated weather station at field site",
    timezone="America/Chicago",  # Required — IANA timezone
    latitude=30.18611,
    longitude=-93.90833,
    contact_name="John Doe",
    contact_email="john@example.com",
)

station = client.stations.create(campaign_id=123, station_create=station_data)
print(f"Created station: {station.id}")
```

!!! important "Timezone is required"
    The `timezone` field is required when creating a station. It must be a valid IANA timezone name (e.g., `America/Chicago`, `UTC`, `Europe/London`). Naive timestamps in uploaded CSVs are interpreted using this timezone.

## Updating a station

```python
from upstream_api_client.models import StationUpdate

update = StationUpdate(
    name="Weather Station Alpha - Updated",
    description="Updated description",
)

updated = client.stations.update(
    station_id=456,
    campaign_id=123,
    station_update=update,
)
```

## Deleting a station

```python
client.stations.delete(station_id=456, campaign_id=123)
```

## Exporting station data

### Export sensors CSV

```python
# As a string
sensors_csv = client.export_sensors_csv(campaign_id=123, station_id=456)
print(sensors_csv)

# Stream to a file
with open("sensors.csv", "wb") as f:
    client.export_sensors_csv(campaign_id=123, station_id=456, output=f)
```

### Export measurements CSV

```python
# As a string
measurements_csv = client.export_measurements_csv(
    campaign_id=123,
    station_id=456,
    start_date="2025-06-01",
    end_date="2025-06-30",
)

# Stream to a file
with open("measurements.csv", "wb") as f:
    client.export_measurements_csv(
        campaign_id=123,
        station_id=456,
        start_date="2025-06-01",
        end_date="2025-06-30",
        output=f,
    )
```

## Publishing a station

```python
result = client.publish_station(
    campaign_id=123,
    station_id=456,
    cascade=True,        # Publish sensors too
    organization="upstream",
)
print(f"Published: {result}")
```

## Unpublishing a station

```python
result = client.unpublish_station(
    campaign_id=123,
    station_id=456,
    cascade=True,
)
```
