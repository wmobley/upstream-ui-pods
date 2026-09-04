# Data Formats

## Measurement data format

Measurements are stored with:

- `collectiontime` — timestamp (stored as `timestamptz`)
- `geometry` — PostGIS geometry point (`Lat_deg`, `Lon_deg` in input)
- One value column per sensor alias

## CSV upload format

### Sensors CSV

| Column | Required | Type | Description |
| --- | --- | --- | --- |
| `alias` | Yes | string | Unique sensor name |
| `variablename` | No | string | Human-readable variable name |
| `units` | No | string | Unit of measurement |
| `postprocess` | No | boolean | Post-processing flag |
| `postprocessscript` | No | string | Script reference |

### Measurements CSV

| Column | Required | Type | Description |
| --- | --- | --- | --- |
| `collectiontime` | Yes | string | ISO 8601 timestamp |
| `Lat_deg` | Yes | float | Latitude (-90 to 90) |
| `Lon_deg` | Yes | float | Longitude (-180 to 180) |
| `{alias}` | Yes | float | One column per sensor alias |

## GeoJSON format

Measurements can be exported as GeoJSON `FeatureCollection`:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-93.90833, 30.18611]
      },
      "properties": {
        "collection_time": "2025-06-02T10:00:00Z",
        "measurement_value": 4.6
      }
    }
  ]
}
```

## Timestamp formats

| Format | Example | Timezone handling |
| --- | --- | --- |
| Naive datetime | `2025-06-02 10:00:00` | Interpreted in station timezone |
| ISO 8601 with Z | `2025-06-02T10:00:00Z` | UTC, passes through unchanged |
| ISO 8601 with offset | `2025-06-02T10:00:00-05:00` | Offset preserved, passes through |
