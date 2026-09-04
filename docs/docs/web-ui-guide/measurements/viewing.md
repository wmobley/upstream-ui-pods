# Viewing Measurements

Measurements are individual observation records. Each measurement includes a timestamp, geographic coordinates, and values for one or more sensors.

## Measurement structure

A measurement record contains:

| Field | Description |
| --- | --- |
| **collectiontime** | When the observation was recorded |
| **Lat_deg** | Latitude in decimal degrees |
| **Lon_deg** | Longitude in decimal degrees |
| **Sensor values** | One value per sensor alias |

## Viewing measurements in the UI

Measurements are displayed in several ways on the station dashboard:

- **Temporal charts** — plotted as points or aggregated lines over time
- **Spatial maps** — plotted as points on a map
- **Measurement table** — tabular view of individual records

## Filtering measurements

You can filter the displayed measurements by:

- **Time range** — use the brush/zoom controls on temporal charts
- **Value range** — filter by measurement value thresholds
- **Sensor selection** — choose which sensors to display

## Measurement details

Click an individual measurement point in a chart or map to see its details:

- Exact timestamp
- Geographic coordinates
- All sensor values at that point

## Measurement notes

You can attach notes to individual measurements. Notes can include:

- Free-text observations
- Optional location (WKT format, e.g., `POINT(lon lat)`)

Notes are visible in the measurement details panel.

## Next steps

- [Export measurements](exporting.md) for use in external tools
- [Publish measurements](../stations/publishing.md) to CKAN for sharing
