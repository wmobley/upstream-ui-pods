# Web UI Guide

The Upstream web interface is the fastest way to explore, manage, and visualize environmental sensor data. This guide covers the core workflows available in the UI.

## Interface overview

After signing in, you land on the **campaigns dashboard**. From there you can:

- Browse and search campaigns
- Create new campaigns
- Open a campaign to see its stations
- Open a station to see sensors, measurements, and visualizations

## Core workflows

| Workflow | Section |
| --- | --- |
| Sign in with Tapis | [Authentication](authentication.md) |
| Create and manage campaigns | [Campaigns](campaigns/creating.md) |
| Create stations and upload data | [Stations](stations/creating.md) |
| View and export measurements | [Measurements](measurements/viewing.md) |
| Explore temporal and spatial charts | [Visualization](../visualization-guide/index.md) |
| Publish datasets to CKAN | [CKAN publishing](campaigns/publishing.md) |
| Manage users, schemas, and pods | [Administration](administration/user-roles.md) |

## Data hierarchy

Upstream organizes data as:

```
Campaign
└── Station
    ├── Sensor
    └── Measurement
```

A **campaign** groups related stations. A **station** is a physical location with a timezone. **Sensors** define what is measured. **Measurements** are the individual observations.

## Quick reference

| What you want to do | Where to look |
| --- | --- |
| Upload CSV data to a station | [Station data upload](stations/uploading-data.md) |
| Export station data as CSV or GeoJSON | [Station data export](stations/exporting-data.md) |
| View sensor statistics | [Sensor statistics](sensors/statistics.md) |
| Configure metadata fields | [Metadata schemas](administration/metadata-schemas.md) |
| Manage user roles and permissions | [User roles](administration/user-roles.md) |

---

!!! info "Under construction"
    GIF and video walkthroughs for key workflows will be added after the initial documentation release.
