# Metadata Schemas via SDK

Manage custom metadata schema fields programmatically.

## Listing schema fields

```python
# List all schema fields
schemas = client.metadata_schema.list_schema()

# List only sensor-scoped fields
sensor_schemas = client.metadata_schema.list_schema(scope="sensor")

# List only active fields
active_schemas = client.metadata_schema.list_schema(active_only=True)
```

## Getting a schema field

```python
schema = client.metadata_schema.get_schema(schema_id=1)
print(f"Key: {schema['key']}")
print(f"Label: {schema['label']}")
print(f"Type: {schema['field_type']}")
print(f"Required: {schema['required']}")
```

## Creating a schema field

```python
result = client.metadata_schema.create_schema(
    scope="sensor",
    key="instrument_type",
    label="Instrument Type",
    field_type="string",
    required=True,
    help_text="Type of measurement instrument",
    units=None,
    ckan_field=None,
    ckan_mode="extra",
    order_index=0,
    active=True,
)
```

### Field types

| Type | Description |
| --- | --- |
| `string` | Free text |
| `number` | Numeric value |
| `date` | Date or timestamp |
| `enum` | Selection from predefined options |
| `bool` | Boolean (true/false) |
| `json` | JSON object |

## Updating a schema field

```python
result = client.metadata_schema.update_schema(
    schema_id=1,
    required=False,
    help_text="Updated help text",
    active=False,
)
```

## Deleting a schema field

```python
client.metadata_schema.delete_schema(schema_id=1)
```

## Managing notes

Notes can be attached at campaign, station, sensor, and measurement scopes:

```python
# Campaign notes
notes = client.notes.list_campaign_notes(campaign_id=123)
client.notes.create_campaign_note(campaign_id=123, content="Important observation")

# Station notes
notes = client.notes.list_station_notes(campaign_id=123, station_id=456)
client.notes.create_station_note(campaign_id=123, station_id=456, content="Station note")

# Sensor notes
notes = client.notes.list_sensor_notes(campaign_id=123, station_id=456, sensor_id=789)

# Measurement notes (with optional location)
client.notes.create_measurement_note(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    measurement_id=101112,
    content="Anomalous reading",
    location="POINT(-93.90833 30.18611)",  # Optional WKT location
)
```
