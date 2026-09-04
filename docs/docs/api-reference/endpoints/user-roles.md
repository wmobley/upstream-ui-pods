# User Roles API

Administrators can manage user roles to control access to administrative features.

## List user roles

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/user-roles
```

## Create or update a user role

```bash
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}' \
  https://your-api.example.com/api/v1/user-roles/{username}
```

## Delete a user role

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/user-roles/{username}
```

## Roles

| Role | Description |
| --- | --- |
| `admin` | Full administrative access |
| (default) | Regular user access |
