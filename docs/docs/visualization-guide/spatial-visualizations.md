# Spatial Visualizations

Spatial visualizations show where measurements were collected and how values vary by location. Upstream provides two complementary map views.

## Heat Map

The Heat Map displays measurement points using color-coded value intervals.

### How it works

- Each measurement is plotted as a colored point on a map
- Colors represent value ranges (intervals)
- A legend shows the color-to-value mapping
- Click legend intervals to filter which value ranges are displayed

### When to use

- Comparing measurement intensity or value ranges across locations
- Identifying spatial patterns in sensor values
- Filtering by value ranges using the legend

### Legend filtering

The Heat Map legend is interactive:

1. Click an interval in the legend to toggle its visibility
2. Only measurements within the selected intervals are shown
3. Click again to restore all intervals

<!-- TODO: Add screenshot of Heat Map with legend filtering -->

## Geometry / Route Map

The Geometry or Route Map displays measurement locations and paths on an interactive Leaflet map.

### How it works

- Measurement locations are plotted as points
- Routes or paths between measurements are shown as lines
- GeoJSON geometry data is rendered directly on the map
- Click points to see measurement details in tooltips/popups

### When to use

- Exploring measurement locations and paths
- Understanding the spatial extent of a station's coverage
- Examining individual measurement locations with context

### Map interactions

- **Pan** — click and drag to move the map
- **Zoom** — scroll or pinch to zoom in/out
- **Click** — click a point to see measurement details
- **Popup** — measurement values appear in a popup on click

<!-- TODO: Add screenshot of Geometry/Route Map with popup -->

## Difference between the maps

| View | Best for | Key feature |
| --- | --- | --- |
| **Heat Map** | Comparing measurement intensity or value ranges across locations | Color-coded legend with interval filtering |
| **Geometry / Route Map** | Exploring paths, individual locations, and spatial context | Interactive popups and route visualization |

## Which map to use

- Use the **Heat Map** when you want to compare values across space
- Use the **Geometry/Route Map** when you want to explore locations and paths
- Both maps can be used together — the station dashboard shows both views

## Exporting

Use measurement export or GeoJSON access when you need to move spatial data into GIS tools (QGIS, ArcGIS, GeoPandas).
