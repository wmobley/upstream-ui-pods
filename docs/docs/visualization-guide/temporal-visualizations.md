# Temporal Visualizations

Temporal visualizations show measurement values over time. Upstream provides two complementary views: a line chart with confidence intervals and a scatter plot.

## Line chart with confidence intervals

Use the line chart to see trends and aggregated variation over time.

### How it works

- Measurement values are aggregated into time buckets (e.g., hourly, daily)
- A line connects the mean values across buckets
- Shaded confidence bands show the variation within each bucket
- The aggregation interval adjusts automatically based on the time range selected

### When to use

- Exploring overall trends in sensor data
- Understanding variability within time periods
- Comparing patterns across different time ranges

<!-- TODO: Add screenshot of line chart with confidence intervals -->

## Scatter plot

Use the scatter plot to inspect individual measurement points.

### How it works

- Each point represents one measurement
- Points are plotted by timestamp (x-axis) and value (y-axis)
- Hover over a point to see the exact timestamp, value, and coordinates
- Click a point to open measurement details

### When to use

- Inspecting individual readings
- Identifying outliers or anomalies
- Examining specific measurements in detail

<!-- TODO: Add screenshot of scatter plot with tooltip -->

## Brushing and zooming

Both temporal views support interactive brushing and zooming:

1. Use the **overview chart** below the main chart to select a time range
2. Drag the handles to narrow or widen the selection
3. The main chart updates to show only the selected range
4. Click **Reset** to return to the full time range

## Downsampling

For large datasets, Upstream may reduce the number of displayed points so charts remain responsive:

- The LTTB (Largest-Triangle-Three-Buckets) algorithm preserves the visual shape of the series
- The number of displayed points is reduced to a configurable threshold
- All measurement data remains in the database — only the display is downsampled
- Export includes all data, not just the downsampled view

## Confidence intervals

Confidence intervals summarize measurement variation within time buckets:

- **Mean line** — average value across all measurements in the bucket
- **Confidence band** — shaded area showing the spread of values
- Band width depends on the number of measurements and their distribution

Wider bands indicate more variability; narrower bands indicate more consistent readings.

## Notes on temporal charts

You can attach notes to specific measurements. Notes appear as markers on the chart and can be viewed by clicking on them.

## Exporting

Use station and measurement export actions when you need CSV or GeoJSON data for analysis outside the UI. The export includes all data, not just what is displayed in the chart.
