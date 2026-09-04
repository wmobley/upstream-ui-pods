# SDK Example Scripts

These example scripts are static code references for common Upstream SDK workflows. Copy them into your own project and replace placeholder values such as credentials, campaign IDs, station IDs, and file paths.

| Example | Purpose |
| --- | --- |
| [`basic-workflow.py`](basic-workflow.py) | Create a campaign and station, upload CSV data, and query measurements. |
| [`csv-upload-large.py`](csv-upload-large.py) | Upload large CSV files with chunking. |
| [`ckan-publish-full.py`](ckan-publish-full.py) | Publish campaign/station data to CKAN. |
| [`geojson-export.py`](geojson-export.py) | Export measurement data as GeoJSON for GIS workflows. |
| [`confidence-intervals.py`](confidence-intervals.py) | Retrieve and plot confidence intervals. |
| [`batch-campaign-setup.py`](batch-campaign-setup.py) | Set up multiple campaigns from scripted inputs. |

!!! warning "Placeholders"
    The scripts include placeholder credentials and IDs. Do not commit real passwords, tokens, or API keys.
