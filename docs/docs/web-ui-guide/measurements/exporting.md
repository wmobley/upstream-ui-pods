# Exporting Measurements

You can export measurement data from a station for use in external analysis tools.

## Export options

From the station dashboard, use the export action to download:

- **CSV** — tabular format for spreadsheets, Python, R, and data analysis
- **GeoJSON** — spatial format for GIS tools and mapping software

## CSV export

The CSV export produces a file with:

```
collectiontime,Lat_deg,Lon_deg,Sensor1,Sensor2,Sensor3
2025-06-02 10:00:00,30.18611,-93.90833,4.6,0.0,10.3
...
```

- Timestamps are in the format they were stored (with timezone info if available)
- One column per sensor alias
- Empty values appear as blank cells

## GeoJSON export

The GeoJSON export produces a `FeatureCollection` with:

- Each measurement as a `Feature` with `Point` geometry
- Properties include timestamp, sensor values, and metadata
- Compatible with QGIS, ArcGIS, GeoPandas, and other GIS tools

## Filtering exports

If you have applied filters in the dashboard (time range, value range, sensor selection), the export respects those filters. This lets you export specific subsets of your data.

## Programmatically export

You can also export data programmatically using the [Python SDK](../../python-sdk-guide/index.md) or [REST API](../../api-reference/index.md).

### SDK example

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient(
    base_url="https://upstreamapi.pods.portals.tapis.io",
    username="your-username",
    password="your-password",
)

# Export sensors CSV
sensors_csv = client.export_sensors_csv(
    campaign_id=123,
    station_id=456,
)

# Export measurements CSV with date filter
measurements_csv = client.export_measurements_csv(
    campaign_id=123,
    station_id=456,
    start_date="2025-06-01",
    end_date="2025-06-30",
)

# Export as GeoJSON
geojson = client.get_measurements_geojson(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
)
```
