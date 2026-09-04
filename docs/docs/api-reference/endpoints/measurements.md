# Measurements API

## List measurements

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements?start_date=2025-06-01&end_date=2025-06-30&limit=100&page=1"
```

**Query parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `start_date` | datetime | Filter start date |
| `end_date` | datetime | Filter end date |
| `min_measurement_value` | float | Minimum value filter |
| `max_measurement_value` | float | Maximum value filter |
| `limit` | int | Maximum items per page |
| `page` | int | Page number |
| `downsample_threshold` | int | Downsampling threshold |

## Create a measurement

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection_time": "2025-06-02T10:00:00Z",
    "latitude": 30.18611,
    "longitude": -93.90833,
    "values": {"River Stage": 4.6, "Rain Increment": 0.0}
  }' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements
```

## Update a measurement

```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"values": {"River Stage": 4.8}}' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements/{measurement_id}
```

## Delete measurements

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements
```

## Get confidence intervals

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements.confidence-intervals?interval=hour&interval_value=1&start_date=2025-06-01&end_date=2025-06-30"
```

## Get GeoJSON

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements.geojson?start_date=2025-06-01&end_date=2025-06-30"
```
