# Troubleshooting

Common issues and solutions when using the Python SDK.

## Authentication errors

### ConfigurationError: Username and password are required

**Cause:** Missing credentials.

**Fix:** Provide `username` and `password` via constructor, environment variables, or configuration file:

```python
client = UpstreamClient(
    username="your-username",
    password="your-password",
    base_url="https://upstreamapi.pods.portals.tapis.io",
)
```

Or set environment variables:

```bash
export UPSTREAM_USERNAME=your-username
export UPSTREAM_PASSWORD=your-password
```

### AuthenticationError: Invalid username or password

**Cause:** Wrong credentials.

**Fix:** Verify your Tapis username and password. Check for extra whitespace or special characters.

### AuthenticationError: Authentication request validation failed

**Cause:** API rejected the authentication request.

**Fix:** Verify the `base_url` points to the API host (`upstreamapi.pods.portals.tapis.io`), not the web host.

## Upload errors

### ValidationError: Sensors file not found

**Cause:** The file path is incorrect or the file does not exist.

**Fix:** Check the file path and ensure the file exists:

```python
from pathlib import Path

sensors_file = Path("sensors.csv")
print(f"Exists: {sensors_file.exists()}")
print(f"Absolute: {sensors_file.absolute()}")
```

### ValidationError: Missing required field 'alias'

**Cause:** Sensors CSV is missing the `alias` column.

**Fix:** Ensure your sensors CSV has these columns: `alias`, `variablename`, `units`

### ValidationError: Latitude must be between -90 and 90

**Cause:** Invalid latitude value in measurements CSV.

**Fix:** Check that `Lat_deg` values are decimal degrees between -90 and 90.

### ValidationError: Measurements file is empty

**Cause:** The measurements CSV has no data rows.

**Fix:** Ensure the CSV has at least a header row and one data row.

## API errors

### APIError: Failed to list campaigns (401)

**Cause:** Token is expired or invalid.

**Fix:** Re-authenticate:

```python
client.authenticate()
```

### APIError: Resource not found (404)

**Cause:** The requested resource does not exist.

**Fix:** Verify the campaign, station, or sensor ID is correct:

```python
campaigns = client.campaigns.list()
for c in campaigns.items:
    print(f"ID: {c.id}, Name: {c.name}")
```

### ValidationError: Campaign validation failed (422)

**Cause:** Invalid data in the request.

**Fix:** Check that all required fields are provided and have correct types.

## Network errors

### NetworkError: Authentication request failed

**Cause:** Cannot reach the API server.

**Fix:** Check your internet connection and verify the `base_url` is correct.

### ConnectionError: Failed to establish a connection

**Cause:** API server is unavailable.

**Fix:** Check the API server status. Try again later.

## Configuration errors

### ConfigurationError: Base URL must start with http:// or https://

**Cause:** Invalid base URL format.

**Fix:** Include the protocol prefix:

```python
client = UpstreamClient(
    base_url="https://upstreamapi.pods.portals.tapis.io",
)
```

### ConfigurationError: Timeout must be positive

**Cause:** Timeout value is zero or negative.

**Fix:** Set a positive timeout value in seconds.
