# Metadata Mapping

Upstream maps campaign and station metadata to CKAN dataset fields.

## Mapping strategy

| Upstream field | CKAN location | Mode |
| --- | --- | --- |
| Campaign name | Dataset `title` | Direct |
| Campaign description | Dataset `notes` | Direct |
| Campaign metadata | Dataset `extras` | Key-value pairs |
| Station metadata | Resource fields | Key-value pairs |

## CKAN modes

| Mode | Description |
| --- | --- |
| `extra` (default) | Store as CKAN extras (key-value metadata) |
| `field` | Store as a direct CKAN field |

## Custom metadata

When using the SDK's `CKANIntegration` class directly, you can add custom metadata:

```python
ckan.publish_campaign(
    campaign_id=123,
    campaign_data=campaign,
    station_measurements=measurements_csv,
    station_sensors=sensors_csv,
    station_data=station,
    dataset_metadata={"custom_field": "value"},
    custom_tags=["research", "field-data"],
)
```

## Solr field size limits

CKAN uses Solr for indexing, which has a 32,766 character limit on individual field values. Upstream automatically truncates large values to stay within this limit.
