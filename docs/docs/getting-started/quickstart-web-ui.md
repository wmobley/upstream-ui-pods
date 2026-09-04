# Web UI Quickstart

This guide walks you through signing in, exploring a campaign, uploading data, and visualizing results using the Upstream web interface.

## Prerequisites

- A Tapis account with access to an Upstream deployment
- Browser access to your Upstream instance (e.g., `https://upstream.pods.portals.tapis.io`)

## Step 1: Sign in

1. Open your Upstream instance URL in a browser.
2. Click **Sign in with Tapis**.
3. Complete the Tapis OAuth2 flow.
4. If prompted, choose the project instance you want to work in.
5. You will land on the campaigns dashboard.

See [Projects and API URLs](../concepts/projects-and-api-urls.md) if you are unsure which project instance to select.

## Step 2: Explore a campaign

1. From the campaigns list, click a campaign name to open it.
2. The campaign page shows associated **stations**, each with a summary of sensors and recent activity.
3. Click a station to see its dashboard with sensor list, measurements, and visualizations.

## Step 3: Upload data

1. Navigate to a station dashboard.
2. Click **Upload Data**.
3. Upload a paired **sensors CSV** and **measurements CSV** file.
4. The upload dialog validates your files before submitting. Review any warnings or errors.

!!! tip "CSV format"
    See the [data preparation guide](../data-preparation/index.md) for CSV format details and templates. Example files are also available in the upload dialog.

## Step 4: Visualize data

Once data is uploaded, the station dashboard displays:

- **Temporal charts** — Time series with confidence intervals and scatter plots for exploring measurements over time.
- **Spatial maps** — Heat maps and route/geometry maps for exploring measurement locations and patterns.

Use the brush/zoom controls on temporal charts to focus on specific time ranges. Hover over data points for detailed tooltips.

## Step 5: Export data

1. From a station or measurement view, look for the **Export** option.
2. Choose your format: **CSV** or **GeoJSON**.
3. The export includes the currently filtered subset of data.

## Step 6: Publish to CKAN (optional)

1. Navigate to a campaign or station.
2. Click **Publish**.
3. Follow the publish dialog to review metadata and confirm publication.
4. The dataset will appear in the connected CKAN portal.

## Next steps

- Learn about the [data model](../concepts/index.md) to understand campaigns, stations, sensors, and measurements.
- Try the [Python SDK quickstart](quickstart-python-sdk.md) for programmatic access.
- Explore [visualization options](../visualization-guide/index.md) in depth.
