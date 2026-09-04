# Error Codes

The Upstream API uses standard HTTP status codes.

## Status codes

| Code | Meaning | Typical cause |
| --- | --- | --- |
| `200` | OK | Successful request |
| `201` | Created | Resource created successfully |
| `204` | No Content | Successful deletion |
| `400` | Bad Request | Invalid request body or parameters |
| `401` | Unauthorized | Missing, invalid, or expired token |
| `403` | Forbidden | Insufficient permissions for the action |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Resource name conflict (e.g., CKAN dataset exists) |
| `422` | Unprocessable Entity | Validation error — check required fields and formats |
| `429` | Too Many Requests | Rate limit exceeded — retry after delay |
| `500` | Internal Server Error | Server error — retry or report |
| `502` | Bad Gateway | Upstream service unavailable |
| `503` | Service Unavailable | Temporary overload or maintenance |

## Error response body

Error responses include a JSON body with details:

```json
{
  "detail": "Campaign not found"
}
```

## Common error scenarios

### Authentication errors

| Scenario | Code | Fix |
| --- | --- | --- |
| No token provided | `401` | Include `Authorization: Bearer <token>` header |
| Expired token | `401` | Re-authenticate and obtain a new token |
| Invalid token | `401` | Verify the token is correct |

### Validation errors

| Scenario | Code | Fix |
| --- | --- | --- |
| Missing required field | `422` | Add the required field to the request body |
| Invalid timestamp format | `422` | Use ISO 8601 format |
| Latitude out of range | `422` | Use value between -90 and 90 |
| Longitude out of range | `422` | Use value between -180 and 180 |

### Permission errors

| Scenario | Code | Fix |
| --- | --- | --- |
| Not campaign owner | `403` | Request access from the campaign owner |
| Admin-only action | `403` | Ask an admin to perform the action |
| CKAN publish without token | `403` | Include a valid Tapis token |
