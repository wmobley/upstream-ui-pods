# Stations API

## List stations

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations?limit=100&page=1"
```

## Create a station

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Station",
    "description": "Station description",
    "timezone": "America/Chicago",
    "latitude": 30.18611,
    "longitude": -93.90833
  }' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations
```

!!! important "The `timezone` field is required and must be a valid IANA timezone name."

## Get a station

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}
```

## Update a station

```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Station Name"}' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}
```

## Delete a station

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}
```

## Export sensors CSV

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/export
```

## Export measurements CSV

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/measurements/export?start_date=2025-06-01&end_date=2025-06-30"
```

## Publish a station

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cascade": true,
    "organization": "upstream",
    "patch_existing_ckan_dataset": false
  }' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/publish
```

## Unpublish a station

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/unpublish
```
