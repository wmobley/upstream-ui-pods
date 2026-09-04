# Statistical Analysis

The SDK provides access to computed sensor statistics and confidence intervals for data analysis.

## Sensor statistics

Each sensor has automatically computed statistics:

```python
sensor = client.sensors.get(
    sensor_id=789,
    station_id=456,
    campaign_id=123,
)

# Access statistics
print(f"Min: {sensor.min_value}")
print(f"Max: {sensor.max_value}")
print(f"Mean: {sensor.mean_value}")
print(f"Std Dev: {sensor.std_value}")
print(f"Count: {sensor.measurement_count}")
```

## Confidence intervals

Retrieve time-aggregated measurements with confidence intervals:

```python
from datetime import datetime

# Hourly aggregation with confidence intervals
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
    print(f"{point.timestamp}: {point.mean:.2f} [{point.lower_bound:.2f}, {point.upper_bound:.2f}]")
```

### Aggregation intervals

| Interval | Description |
| --- | --- |
| `minute` | Per-minute aggregation |
| `hour` | Hourly aggregation |
| `day` | Daily aggregation |

### Interval value

The `interval_value` parameter controls the size of each aggregation window. For example:

- `interval="hour", interval_value=1` — hourly aggregation
- `interval="hour", interval_value=6` — 6-hour aggregation
- `interval="day", interval_value=1` — daily aggregation

## Downsampled measurements

For large datasets, use the downsample threshold:

```python
measurements = client.measurements.list(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    downsample_threshold=1000,  # Reduce to ~1000 points
)
```

The downsampled data preserves the visual shape of the series while reducing the number of points for efficient rendering.

## Force update statistics

If statistics seem stale after a large upload:

```python
# Update all sensors in a station
client.sensors.force_update_statistics(
    campaign_id=123,
    station_id=456,
)

# Update a single sensor
client.sensors.force_update_single_sensor_statistics(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
)
```
