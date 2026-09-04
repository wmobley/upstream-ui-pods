# Environment URLs

## Production

| Service | URL |
| --- | --- |
| **Web UI** | `https://upstream.pods.portals.tapis.io` |
| **API** | `https://upstreamapi.pods.portals.tapis.io` |
| **API docs (Swagger)** | `https://upstreamapi.pods.portals.tapis.io/docs` |
| **CKAN portal** | `https://ckan.tacc.utexas.edu` |

## Project instances

Upstream can expose multiple project-specific API instances. Do not rely on a static list of project URLs; available projects can change, and each user may have access to a different set.

To find the project API URLs available to you:

1. Open the Upstream web UI.
2. Sign in with Tapis.
3. Use the project selector in the header to choose a project instance.
4. Open the API docs link in the header.
5. Remove `/docs` from that Swagger URL to get the API base URL for SDK and REST calls.

See [Projects and API URLs](../concepts/projects-and-api-urls.md) for how the UI chooses an API URL.

## SDK base URLs

When using the Python SDK, set the base URL to the API host:

```python
# Production
client = UpstreamClient(
    base_url="https://upstreamapi.pods.portals.tapis.io",
    ...
)

# Another project instance
client = UpstreamClient(
    base_url="https://example-project-api.example.org",
    ...
)
```

!!! note "Automatic URL normalization"
    The SDK automatically rewrites web host URLs (`upstream.pods.portals.tapis.io`) to API host URLs (`upstreamapi.pods.portals.tapis.io`). You can pass either form.
