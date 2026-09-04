# User Management

Administrators can manage user roles to control access to administrative features.

## Roles

| Role | Capabilities |
| --- | --- |
| **Admin** | Full administrative access including user management, metadata schemas, and pod bundles |
| **Regular user** | View campaigns, manage own data, upload, export, publish |

## Managing roles in the UI

1. Navigate to **Administration** > **User Roles**
2. View, add, edit, or remove user roles

See [Web UI — User Roles](../web-ui-guide/administration/user-roles.md) for detailed instructions.

## Managing roles via SDK

```python
client.list_user_roles()
client.upsert_user_role(username="user", role="admin")
client.delete_user_role(username="user")
```

## Managing roles via API

```bash
# List roles
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/user-roles

# Assign role
curl -X PUT -H "Authorization: Bearer $TOKEN" \
  -d '{"role": "admin"}' \
  https://your-api.example.com/api/v1/user-roles/{username}

# Delete role
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/user-roles/{username}
```
