# REST API Quickstart

This guide shows how to authenticate and make API calls to the Upstream backend directly using `curl` or any HTTP client.

## Prerequisites

- Your project’s Upstream API base URL. You can find this from the project selector and API docs link in the web UI.
- A valid Tapis access token or credentials to obtain one

## Base URL

All API endpoints are under:

```
https://your-upstream-api.example.com/api/v1
```

Use the API URL for the project instance you want to access. See [Projects and API URLs](../concepts/projects-and-api-urls.md) for how to find it.

## Authentication

Obtain a Tapis access token and pass it in the `Authorization` header:

```bash
TOKEN="your-tapis-access-token"

curl -H "Authorization: Bearer $TOKEN" \
  https://your-upstream-api.example.com/api/v1/campaigns
```

For complete authentication details, see the [authentication guide](../concepts/authentication.md).

## List campaigns

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-upstream-api.example.com/api/v1/campaigns
```

## Get a campaign

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-upstream-api.example.com/api/v1/campaigns/{campaign_id}
```

## List stations in a campaign

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-upstream-api.example.com/api/v1/campaigns/{campaign_id}/stations"
```

## Retrieve measurements

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-upstream-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements?start_date=2025-06-01&end_date=2025-06-30"
```

## Upload CSV data

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "upload_file_sensors=@sensors.csv" \
  -F "upload_file_measurements=@measurements.csv" \
  https://your-upstream-api.example.com/api/v1/uploadfile_csv/campaign/{campaign_id}/station/{station_id}/sensor
```

## Error handling

The API returns standard HTTP status codes:

| Code | Meaning |
| --- | --- |
| `200` | Success |
| `201` | Created |
| `400` | Bad request — check request body or parameters |
| `401` | Unauthorized — check or refresh your token |
| `403` | Forbidden — insufficient permissions |
| `404` | Not found |
| `422` | Validation error — check required fields |
| `500` | Server error — retry or report |

## Next steps

- Explore the [API Swagger documentation](https://upstreamapi.pods.portals.tapis.io/docs) for the complete endpoint reference.
- Learn about [pagination](../api-reference/pagination.md) for large result sets.
- See the [SDK quickstart](quickstart-python-sdk.md) for a higher-level Python interface.
