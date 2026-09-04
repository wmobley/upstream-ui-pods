# Geospatial Analysis

The SDK provides GeoJSON export and geospatial data access for use with GIS tools and spatial analysis libraries.

## Exporting GeoJSON

```python
from datetime import datetime

# Get measurements as GeoJSON
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
    json.dump(geojson, f, indent=2)
```

## GeoJSON structure

The returned GeoJSON is a `FeatureCollection`:

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
        "measurement_value": 4.6,
        "sensor_alias": "River Stage"
      }
    }
  ]
}
```

## Filtering by value range

```python
# Only include measurements within a value range
geojson = client.get_measurements_geojson(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    min_measurement_value=0.0,
    max_measurement_value=50.0,
)
```

## Using with GeoPandas

```python
import json
import geopandas as gpd

with open("measurements.geojson") as f:
    geojson = json.load(f)

gdf = gpd.GeoDataFrame.from_features(geojson["features"])

# Now you can use GeoPandas operations
print(gdf.bounds)       # Bounding box
print(gdf.geometry.centroid)  # Centroids
```

## Using with QGIS

1. Export measurements as GeoJSON from the SDK
2. Open QGIS
3. Layer > Add Layer > Add Vector Layer
4. Select the `.geojson` file
5. The measurement points appear on the map with attributes

## Station geometry

Station geometry is available in the station response and is included in CKAN publications:

```python
station = client.stations.get(station_id=456, campaign_id=123)
print(f"Station geometry: {station.geometry}")
```
