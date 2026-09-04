# Public CKAN Portal

Published Upstream data is accessible through the connected CKAN portal.

## Accessing published data

1. Publish a campaign or station from Upstream.
2. Navigate to the CKAN portal (e.g., `https://ckan.tacc.utexas.edu`).
3. Search for the dataset by name or tags.
4. Download resources (CSV files) directly from the portal.

## Dataset URL pattern

Published datasets are available at:

```
https://ckan.tacc.utexas.edu/dataset/upstream-campaign-{campaign_id}
```

## What's in the portal

Each published dataset includes:

- **Dataset page** — metadata, description, and contact information
- **Sensors CSV** — sensor configuration and metadata
- **Measurements CSV** — measurement data
- **Preview** — inline data preview (if supported by CKAN)
- **API access** — CKAN DataStore API for programmatic access

## Data reuse

Published data can be:

- Downloaded as CSV for analysis in Python, R, Excel, or other tools
- Accessed via the CKAN DataStore API
- Integrated into other CKAN-based data portals
- Cited with a DOI (if the CKAN instance supports DOI minting)
