# API Quick Reference

Quick reference for the most common Upstream API endpoints.

## Base URL

```
https://upstreamapi.pods.portals.tapis.io/api/v1
```

## Authentication

All endpoints require a Tapis access token in the `Authorization` header:

```bash
TOKEN="your-tapis-access-token"
curl -H "Authorization: Bearer $TOKEN" https://your-api.example.com/api/v1/campaigns
```

## Endpoints by resource

### Campaigns

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/campaigns` | List campaigns |
| `POST` | `/campaigns` | Create a campaign |
| `GET` | `/campaigns/{campaign_id}` | Get a campaign |
| `PATCH` | `/campaigns/{campaign_id}` | Update a campaign |
| `DELETE` | `/campaigns/{campaign_id}` | Delete a campaign |
| `POST` | `/campaigns/{campaign_id}/publish` | Publish to CKAN |
| `POST` | `/campaigns/{campaign_id}/unpublish` | Unpublish from CKAN |
| `GET` | `/campaigns/{campaign_id}/permissions` | Get permissions |

### Stations

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/campaigns/{campaign_id}/stations` | List stations |
| `POST` | `/campaigns/{campaign_id}/stations` | Create a station |
| `GET` | `/campaigns/{campaign_id}/stations/{station_id}` | Get a station |
| `PATCH` | `/campaigns/{campaign_id}/stations/{station_id}` | Update a station |
| `DELETE` | `/campaigns/{campaign_id}/stations/{station_id}` | Delete a station |
| `POST` | `/campaigns/{campaign_id}/stations/{station_id}/publish` | Publish station |
| `POST` | `/campaigns/{campaign_id}/stations/{station_id}/unpublish` | Unpublish station |

### Sensors

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/campaigns/{campaign_id}/stations/{station_id}/sensors` | List sensors |
| `GET` | `/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}` | Get a sensor |
| `PATCH` | `/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}` | Update a sensor |
| `DELETE` | `/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}` | Delete a sensor |
| `POST` | `/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/publish` | Publish sensor |
| `POST` | `/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/unpublish` | Unpublish sensor |

### Measurements

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `.../sensors/{sensor_id}/measurements` | List measurements |
| `POST` | `.../sensors/{sensor_id}/measurements` | Create a measurement |
| `PATCH` | `.../measurements/{measurement_id}` | Update a measurement |
| `DELETE` | `.../measurements` | Delete all measurements for sensor |
| `GET` | `.../measurements.confidence-intervals` | Get confidence intervals |
| `GET` | `.../measurements.geojson` | Get GeoJSON |

### Upload

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/uploadfile_csv/campaign/{campaign_id}/station/{station_id}/sensor` | Upload CSV files |

### Administration

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/user-roles` | List user roles |
| `PUT` | `/user-roles/{username}` | Create/update user role |
| `DELETE` | `/user-roles/{username}` | Delete user role |
| `GET` | `/metadata-schema` | List metadata schema fields |
| `POST` | `/metadata-schema` | Create schema field |
| `PATCH` | `/metadata-schema/{schema_id}` | Update schema field |
| `DELETE` | `/metadata-schema/{schema_id}` | Delete schema field |
| `GET` | `/sensor_variables` | List sensor variables |
| `POST` | `/pods/bundle` | Create pod bundle |
| `GET` | `/ckan/organizations` | List CKAN organizations |

## Common query parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `limit` | int | Maximum items per page |
| `page` | int | Page number |
| `start_date` | datetime | Filter start date |
| `end_date` | datetime | Filter end date |
| `min_measurement_value` | float | Minimum value filter |
| `max_measurement_value` | float | Maximum value filter |
| `downsample_threshold` | int | Downsampling threshold |

## Pagination

List endpoints return paginated results:

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 50,
  "pages": 2
}
```

## Error responses

| Code | Meaning |
| --- | --- |
| `400` | Bad request — check request body or parameters |
| `401` | Unauthorized — check or refresh your token |
| `403` | Forbidden — insufficient permissions |
| `404` | Not found — resource does not exist |
| `422` | Validation error — check required fields |
| `429` | Rate limit exceeded — retry after delay |
| `500` | Server error — retry or report |
