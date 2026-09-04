# Metadata Schemas

Define custom fields for campaigns, stations, and sensors.

## Overview

Metadata schema fields let you extend Upstream's data model with custom properties. These fields appear in the UI and are included in CKAN publications.

## Managing schemas in the UI

1. Navigate to **Administration** > **Metadata Schema**
2. Create, edit, or delete schema fields

See [Web UI — Metadata Schemas](../web-ui-guide/administration/metadata-schemas.md) for detailed instructions.

## Managing schemas via SDK

```python
# List fields
schemas = client.metadata_schema.list_schema(scope="sensor")

# Create a field
client.metadata_schema.create_schema(
    scope="sensor",
    key="instrument_type",
    label="Instrument Type",
    field_type="string",
    required=True,
)

# Update a field
client.metadata_schema.update_schema(schema_id=1, required=False)

# Delete a field
client.metadata_schema.delete_schema(schema_id=1)
```

## Managing schemas via API

See [API — Metadata Schema](../api-reference/endpoints/metadata-schemas.md) for endpoint details.
