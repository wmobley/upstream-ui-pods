# Pod Bundles

Pod bundles are deployment units in the Upstream platform. Administrators can create pod bundles to configure new Upstream instances.

## What is a pod bundle

A pod bundle contains the configuration needed to deploy an Upstream instance, including:

- **Base name** — identifier for the pod bundle
- **Postgres username** — database user for the instance
- **Postgres password** — database password for the instance

Pod bundle creation requires a valid Tapis access token.

## Creating a pod bundle

1. Navigate to **Administration** > **Pod Bundles**.
2. Click **Create Pod Bundle**.
3. Fill in the required fields:
    - **Base name** — unique identifier
    - **Postgres username** — database username
    - **Postgres password** — database password
4. Click **Create**.

## Creating a pod bundle via SDK

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient(
    base_url="https://upstreamapi.pods.portals.tapis.io",
    username="admin-username",
    password="admin-password",
)

# Create a pod bundle
result = client.create_pod_bundle(
    base="my-upstream-instance",
    pg_user="upstream_user",
    pg_password="secure_password_here",
)
```

## Creating a pod bundle via API

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "base": "my-upstream-instance",
    "pg_user": "upstream_user",
    "pg_password": "secure_password_here"
  }' \
  https://your-upstream-api.example.com/api/v1/pods/bundle
```

## Security considerations

- Pod bundle creation requires a Tapis access token with appropriate permissions.
- Postgres credentials are transmitted securely but should be changed after initial deployment.
- Do not commit pod bundle credentials to version control.
