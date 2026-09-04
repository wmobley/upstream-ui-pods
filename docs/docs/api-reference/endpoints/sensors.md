# Sensors API

## List sensors

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors?limit=100&page=1"
```

## Get a sensor

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}
```

## Update a sensor

```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variablename": "Updated Variable Name",
    "units": "feet"
  }' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}
```

## Delete a sensor

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}
```

## Publish a sensor

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cascade": true, "organization": "upstream"}' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/publish
```

## Unpublish a sensor

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/unpublish
```

## Update sensor statistics

```bash
# Update all sensors in a station
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/statistics

# Update a single sensor
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/statistics
```
