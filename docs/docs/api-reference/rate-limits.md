# Rate Limits

The Upstream API applies rate limits to protect against excessive usage.

## Current limits

!!! info "Note"
    Rate limit details may vary by deployment. The following are general guidelines.

| Scope | Typical limit |
| --- | --- |
| Per token | 100 requests per minute |
| Upload endpoints | 10 requests per minute |
| Export endpoints | 30 requests per minute |

## Rate limit response

When rate limits are exceeded, the API returns:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

## Handling rate limits

### In scripts and applications

```python
import time
import requests

def make_request_with_retry(url, headers, max_retries=3):
    for attempt in range(max_retries):
        response = requests.get(url, headers=headers)
        
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 60))
            print(f"Rate limited. Retrying in {retry_after}s...")
            time.sleep(retry_after)
            continue
        
        response.raise_for_status()
        return response.json()
    
    raise Exception("Max retries exceeded")
```

### In curl

```bash
# Check for rate limit headers
curl -I -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns

# Look for:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 95
# Retry-After: 60 (only on 429 responses)
```

## Best practices

- **Batch operations** — use bulk endpoints when available instead of many individual requests
- **Cache responses** — cache list results locally when data doesn't change frequently
- **Respect Retry-After** — always wait the recommended duration before retrying
- **Use pagination** — fetch large result sets in pages rather than all at once
