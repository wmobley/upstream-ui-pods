# CKAN Dataset Structure

When Upstream publishes data to CKAN, it creates datasets with a consistent structure.

## Dataset naming

Published datasets follow the naming pattern:

```
upstream-campaign-{campaign_id}
```

You can override this with a custom `ckan_dataset_name`.

## Dataset metadata

CKAN datasets include these extras:

| Key | Description |
| --- | --- |
| `source` | Always `"Upstream Platform"` |
| `data_type` | Always `"environmental_sensor_data"` |
| `campaign_id` | Upstream campaign ID |
| `campaign_name` | Campaign name |
| `campaign_description` | Campaign description |
| `campaign_contact_name` | Campaign contact |
| `campaign_contact_email` | Campaign contact email |
| `campaign_allocation` | Project allocation reference |

## Station metadata

Each resource includes station-level metadata:

| Key | Description |
| --- | --- |
| `station_id` | Upstream station ID |
| `station_name` | Station name |
| `station_description` | Station description |
| `station_geometry` | Station geometry (GeoJSON) |
| `station_sensors_count` | Number of sensors |

## Resources

Each published station creates two CKAN resources:

1. **Sensors Configuration** — CSV with sensor metadata
2. **Measurement Data** — CSV with measurement observations

Resource names include a timestamp:

```
{station_name} - Sensors Configuration - {timestamp}
{station_name} - Measurement Data - {timestamp}
```

## Tags

Published datasets include these default tags:

- `environmental`
- `sensors`
- `upstream`

Custom tags can be added when publishing via the SDK.
