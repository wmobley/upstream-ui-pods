# SDK Configuration

The SDK supports multiple configuration sources with a clear precedence order.

## Configuration precedence

1. Direct constructor parameters (highest priority)
2. Configuration file (YAML or JSON)
3. Environment variables
4. Default values (lowest priority)

## Constructor parameters

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient(
    username="your-username",
    password="your-password",
    base_url="https://upstreamapi.pods.portals.tapis.io",
    ckan_url="https://ckan.tacc.utexas.edu",
    ckan_organization="upstream",
)
```

## Configuration file

Create a `config.yaml` file:

```yaml
upstream:
  username: your-username
  password: your-password
  base_url: https://upstreamapi.pods.portals.tapis.io
  verify_ssl: true
  ssl_ca_cert: /path/to/ca-bundle.crt

ckan:
  url: https://ckan.tacc.utexas.edu
  organization: upstream

upload:
  chunk_size: 10000
  max_file_size_mb: 50
  timeout_seconds: 30
  retry_attempts: 3
```

Or a `config.json` file:

```json
{
  "upstream": {
    "username": "your-username",
    "password": "your-password",
    "base_url": "https://upstreamapi.pods.portals.tapis.io"
  },
  "ckan": {
    "url": "https://ckan.tacc.utexas.edu",
    "organization": "upstream"
  }
}
```

Load the configuration file:

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient.from_config("config.yaml")
```

## Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `UPSTREAM_USERNAME` | Upstream username | — |
| `UPSTREAM_PASSWORD` | Upstream password | — |
| `UPSTREAM_BASE_URL` | API base URL | `https://upstreamapi.pods.portals.tapis.io` |
| `CKAN_URL` | CKAN portal URL | `https://ckan.tacc.utexas.edu` |
| `CKAN_ORGANIZATION` | CKAN organization name | — |
| `UPSTREAM_VERIFY_SSL` | Verify SSL certificates | `true` |
| `UPSTREAM_SSL_CA_CERT` | Path to CA bundle | system default |

## Configuration options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `timeout` | int | `30` | HTTP request timeout in seconds |
| `max_retries` | int | `3` | Maximum retry attempts |
| `chunk_size` | int | `10000` | Records per upload chunk |
| `max_chunk_size_mb` | int | `50` | Maximum file size in MB before chunking |
| `verify_ssl` | bool | `true` | Whether to verify SSL certificates |
| `ssl_ca_cert` | str | system | Path to CA bundle for HTTPS verification |

## Saving configuration

You can save the current configuration to a file:

```python
client.get_config()  # Returns configuration dictionary
```

## Base URL normalization

The SDK automatically normalizes base URLs:

- If you pass `https://upstream.pods.portals.tapis.io`, it is automatically rewritten to `https://upstreamapi.pods.portals.tapis.io` (the API host).
- For project-specific instances, use that project’s API host directly. Find it from the project selector and API docs link in the web UI.
- If your URL ends with `/api/v1`, the suffix is stripped since the SDK appends API paths internally.

See [Projects and API URLs](../concepts/projects-and-api-urls.md) for multi-project guidance.
