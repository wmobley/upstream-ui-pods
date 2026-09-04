# CKAN Integration

CKAN publishing makes curated Upstream data discoverable in a public data catalog.

## Overview

Upstream can publish campaign, station, and sensor data to a CKAN portal. Published data appears as CKAN datasets with attached resources (CSV files) and metadata extras.

## Publishing methods

| Method | Best for |
| --- | --- |
| **Web UI** | Interactive one-off publishing |
| **Python SDK** | Scripted and automated publishing |
| **REST API** | Custom integrations and tools |

## What gets published

When you publish a station, Upstream creates or updates:

- **CKAN dataset** — with campaign/station metadata as extras
- **Sensors CSV resource** — sensor configuration
- **Measurements CSV resource** — measurement data

## Guides

| Topic | Page |
| --- | --- |
| Publishing from UI | [Publishing from UI](publishing-from-ui.md) |
| Publishing from SDK | [Publishing from SDK](publishing-from-sdk.md) |
| Publishing from API | [Publishing from API](publishing-from-api.md) |
| Dataset structure | [Dataset structure](dataset-structure.md) |
| Metadata mapping | [Metadata mapping](metadata-mapping.md) |
| Troubleshooting | [Troubleshooting](troubleshooting.md) |
| Public portal | [Public portal](public-portal.md) |
