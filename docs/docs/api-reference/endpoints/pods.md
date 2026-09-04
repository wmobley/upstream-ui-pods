# Pods API

Manage pod bundles for Upstream deployment.

## Create a pod bundle

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-TAPIS-TOKEN: your-tapis-jwt" \
  -d '{
    "base": "my-upstream-instance",
    "pg_user": "upstream_user",
    "pg_password": "secure_password"
  }' \
  https://your-api.example.com/api/v1/pods/bundle
```

Requires a valid Tapis access token with appropriate permissions.
