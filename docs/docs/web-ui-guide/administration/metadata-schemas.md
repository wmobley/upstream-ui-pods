# Metadata Schemas

Metadata schemas let administrators define custom fields for campaigns, stations, and sensors. These fields appear in the UI and are included in CKAN publications.

## Schema fields

Each metadata schema field has:

| Property | Description |
| --- | --- |
| **scope** | Where the field applies: `campaign`, `station`, or `sensor` |
| **key** | Internal field identifier |
| **label** | Display label in the UI |
| **field_type** | Data type: `string`, `number`, `date`, `enum`, `bool`, `json` |
| **required** | Whether the field must be filled in |
| **help_text** | Optional help text shown in the UI |
| **units** | Optional unit label for numeric fields |
| **ckan_field** | Optional CKAN field mapping |
| **ckan_mode** | How to map to CKAN: `extra` (default) or `field` |
| **order_index** | Display order in the UI |
| **active** | Whether the field is currently active |
| **options** | Configuration for enum fields (list of allowed values) |

## Viewing metadata schemas

1. Navigate to **Administration** > **Metadata Schemas**.
2. Use the scope filter to view fields for campaigns, stations, or sensors.

## Creating a schema field

1. Navigate to **Administration** > **Metadata Schemas**.
2. Click **Add Field**.
3. Fill in the field properties:
    - Select the **scope** (campaign, station, or sensor)
    - Enter a **key** (internal identifier)
    - Enter a **label** (display name)
    - Select the **field_type**
    - Set whether the field is **required**
    - Optionally add help text and units
4. Click **Create**.

## Editing a schema field

1. Navigate to **Administration** > **Metadata Schemas**.
2. Click **Edit** next to the field you want to modify.
3. Update properties and save.

## Deleting a schema field

1. Navigate to **Administration** > **Metadata Schemas**.
2. Click **Delete** next to the field.
3. Confirm the action.

!!! warning "Deleting schema fields"
    Deleting a schema field removes it from the UI but does not remove existing data values.

## Managing schemas via SDK

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient(
    base_url="https://upstreamapi.pods.portals.tapis.io",
    username="admin-username",
    password="admin-password",
)

# List all schema fields
schemas = client.metadata_schema.list_schema()

# List only sensor-scoped fields
sensor_schemas = client.metadata_schema.list_schema(scope="sensor")

# Create a new field
client.metadata_schema.create_schema(
    scope="sensor",
    key="instrument_type",
    label="Instrument Type",
    field_type="string",
    required=True,
    help_text="Type of measurement instrument",
)

# Update a field
client.metadata_schema.update_schema(
    schema_id=1,
    required=False,
    help_text="Updated help text",
)

# Delete a field
client.metadata_schema.delete_schema(schema_id=1)
```

## Managing schemas via API

```bash
# List schema fields
curl -H "Authorization: Bearer $TOKEN" \
  https://your-upstream-api.example.com/api/v1/metadata-schema

# Create a schema field
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scope": "sensor",
    "key": "instrument_type",
    "label": "Instrument Type",
    "field_type": "string",
    "required": true
  }' \
  https://your-upstream-api.example.com/api/v1/metadata-schema
```
