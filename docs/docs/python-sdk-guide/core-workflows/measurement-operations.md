# Measurement Operations

The SDK provides measurement operations through the `MeasurementManager`.

## Listing measurements

```python
from datetime import datetime

measurements = client.measurements.list(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    start_date=datetime(2025, 6, 1),
    end_date=datetime(2025, 6, 30),
)

for m in measurements.items:
    print(f"{m.collection_time} — {m.values}")
```

## Filtering measurements

```python
# Filter by value range
measurements = client.measurements.list(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    min_measurement_value=0.0,
    max_measurement_value=100.0,
    limit=50,
    page=1,
)

# Downsample for large datasets
measurements = client.measurements.list(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    downsample_threshold=1000,
)
```

## Creating a measurement

```python
from upstream_api_client.models import MeasurementIn

measurement = MeasurementIn(
    collection_time="2025-06-02T10:00:00Z",
    latitude=30.18611,
    longitude=-93.90833,
    values={"River Stage": 4.6, "Rain Increment": 0.0},
)

created = client.measurements.create(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    measurement_in=measurement,
)
```

## Updating a measurement

```python
from upstream_api_client.models import MeasurementUpdate

update = MeasurementUpdate(
    values={"River Stage": 4.8},
)

updated = client.measurements.update(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    measurement_id=101112,
    measurement_update=update,
)
```

## Deleting measurements

```python
# Delete all measurements for a sensor
client.measurements.delete(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
)
```

## Getting confidence intervals

```python
from datetime import datetime

aggregated = client.measurements.get_with_confidence_intervals(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    interval="hour",
    interval_value=1,
    start_date=datetime(2025, 6, 1),
    end_date=datetime(2025, 6, 30),
)

for point in aggregated:
    print(f"{point.timestamp}: {point.mean} [{point.lower_bound}, {point.upper_bound}]")
```

## Getting GeoJSON

```python
from datetime import datetime

geojson = client.get_measurements_geojson(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    start_date=datetime(2025, 6, 1),
    end_date=datetime(2025, 6, 30),
)

# Save to file
import json
with open("measurements.geojson", "w") as f:
    json.dump(geojson, f)
```
