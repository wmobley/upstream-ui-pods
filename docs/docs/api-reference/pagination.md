# Pagination

List endpoints return results in pages so large datasets can be loaded predictably.

Common query parameters:

| Parameter | Meaning |
| --- | --- |
| `limit` | Maximum number of items returned in one response. |
| `page` | Page number to retrieve. |

Example:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-upstream-api.example.com/api/v1/campaigns?limit=50&page=1"
```

Responses typically include an `items` list and pagination metadata such as total count.
