# Sensor Statistics

Upstream automatically computes and stores statistics for each sensor. These statistics summarize the measurement data and are used by visualization components.

## Available statistics

For each sensor, Upstream computes:

| Statistic | Description |
| --- | --- |
| **Min value** | Minimum measurement value |
| **Max value** | Maximum measurement value |
| **Mean** | Average measurement value |
| **Standard deviation** | Spread of measurement values |
| **Percentiles** | Distribution percentiles (e.g., 25th, 50th, 75th) |
| **Measurement count** | Total number of measurements |

## When statistics are updated

Statistics are automatically recalculated when:

- New data is uploaded to the station
- Measurements are added, updated, or deleted

You can also trigger a manual recalculation from the station or sensor dashboard.

## Using statistics

Statistics are useful for:

- **Quick data exploration** — understand the range and distribution of values without loading all measurements
- **Identifying anomalies** — compare individual measurements against computed statistics
- **Setting visualization bounds** — the UI uses statistics to set default axis ranges and legend intervals

## Force update statistics

If statistics seem stale or incorrect, you can force a recalculation:

1. Open the station dashboard.
2. Click **Update Statistics** or use the sensor-level statistics action.
3. The system recalculates all statistics for the station's sensors.

This is typically only needed if you suspect a computation error after a large data upload.
