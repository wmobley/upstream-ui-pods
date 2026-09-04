# Measurements CSV Format

The measurements CSV file contains the actual observation data.

## Required columns

| Column | Required | Type | Description |
| --- | --- | --- | --- |
| `collectiontime` | Yes | string | ISO 8601 timestamp |
| `Lat_deg` | Yes | float | Latitude in decimal degrees (-90 to 90) |
| `Lon_deg` | Yes | float | Longitude in decimal degrees (-180 to 180) |
| One column per sensor alias | Yes | float | Column name must match a sensor alias exactly |

## Example

```csv
collectiontime,Lat_deg,Lon_deg,River Stage,Rain Increment,Flow Volume
2025-06-02 11:00:00,30.18611,-93.90833,4.6,0.0,10.3
2025-06-02 10:45:00,30.18611,-93.90833,4.6,0.0,10.3
2025-06-02 10:30:00,30.18611,-93.90833,4.6,0.0,10.6
```

## Timestamp formats

| Format | Example | Timezone handling |
| --- | --- | --- |
| Naive datetime | `2025-06-02 10:00:00` | Interpreted in station timezone |
| ISO 8601 with Z | `2025-06-02T10:00:00Z` | UTC, passes through unchanged |
| ISO 8601 with offset | `2025-06-02T10:00:00-05:00` | Offset preserved |

## Rules

- Column names for sensor values **must exactly match** the `alias` values in the sensors CSV
- Column matching is **case-sensitive**
- **Blank cells** are automatically skipped (no error)
- Each row should represent one observation at one point in time and space
- Coordinates should reflect the measurement location

## Coordinate format

- **Latitude** (`Lat_deg`): decimal degrees, -90 to 90
- **Longitude** (`Lon_deg`): decimal degrees, -180 to 180
- Use negative values for south and west

Example Texas coordinates: `30.18611, -93.90833`
