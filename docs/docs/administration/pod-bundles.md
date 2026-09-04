# Pod Bundles

Pod bundles are deployment configuration units for Upstream instances.

## Overview

Pod bundles contain the configuration needed to deploy a new Upstream instance, including database credentials.

## Managing pods in the UI

1. Navigate to **Administration** > **Pod Bundles**
2. Create new pod bundles

See [Web UI — Pod Bundles](../web-ui-guide/administration/pod-bundles.md) for detailed instructions.

## Managing pods via SDK

```python
result = client.create_pod_bundle(
    base="my-instance",
    pg_user="upstream_user",
    pg_password="secure_password",
)
```

## Managing pods via API

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "X-TAPIS-TOKEN: your-tapis-jwt" \
  -d '{"base": "my-instance", "pg_user": "user", "pg_password": "pass"}' \
  https://your-api.example.com/api/v1/pods/bundle
```

## Security

- Pod bundle creation requires a valid Tapis token
- Change database credentials after initial deployment
- Do not commit credentials to version control
