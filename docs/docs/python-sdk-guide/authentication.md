# SDK Authentication

The SDK authenticates using Tapis OAuth2. You need a username and password for your Upstream instance.

## Authenticating with credentials

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient(
    base_url="https://upstreamapi.pods.portals.tapis.io",
    username="your-username",
    password="your-password",
)
```

The client automatically authenticates on the first API call. Tokens are refreshed automatically.

## Using environment variables

```python
from upstream_sdk import UpstreamClient

# Reads from UPSTREAM_USERNAME, UPSTREAM_PASSWORD, UPSTREAM_BASE_URL
client = UpstreamClient.from_environment()
```

## Using a configuration file

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient.from_config("config.yaml")
```

See [Configuration](configuration.md) for configuration file format details.

## Token management

- Tokens are obtained automatically on first use
- Tokens are refreshed automatically when they expire (with a 5-minute buffer)
- You can force re-authentication by calling `client.authenticate()`
- You can check authentication status with `client.is_authenticated()`
- You can explicitly log out with `client.logout()`

## Passing tokens directly

For long-running scripts, you can pass an existing Tapis token:

```python
# The SDK handles token refresh automatically
# but you can check if you need to re-authenticate
if not client.is_authenticated():
    client.authenticate()
```

## Common authentication errors

| Error | Cause | Fix |
| --- | --- | --- |
| `ConfigurationError` | Missing username or password | Provide both `username` and `password` |
| `AuthenticationError` | Invalid credentials | Check your username and password |
| `NetworkError` | Cannot reach the API server | Verify `base_url` is correct and accessible |
