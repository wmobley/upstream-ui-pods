# Metadata Schema API

Manage custom metadata schema fields for campaigns, stations, and sensors.

## List schema fields

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-api.example.com/api/v1/metadata-schema?scope=sensor&active_only=true"
```

**Query parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `scope` | string | Filter by scope: `campaign`, `station`, or `sensor` |
| `active_only` | bool | Only return active fields |

## Get a schema field

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/metadata-schema/{schema_id}
```

## Create a schema field

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scope": "sensor",
    "key": "instrument_type",
    "label": "Instrument Type",
    "field_type": "string",
    "required": true,
    "help_text": "Type of measurement instrument",
    "order_index": 0,
    "active": true
  }' \
  https://your-api.example.com/api/v1/metadata-schema
```

**Field types:** `string`, `number`, `date`, `enum`, `bool`, `json`

## Update a schema field

```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"required": false, "help_text": "Updated help text"}' \
  https://your-api.example.com/api/v1/metadata-schema/{schema_id}
```

## Delete a schema field

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/metadata-schema/{schema_id}
```
