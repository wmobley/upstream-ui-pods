# User Roles

Upstream uses a role-based access control system. Administrators can manage user roles to control who can perform administrative actions.

## Available roles

| Role | Capabilities |
| --- | --- |
| **Regular user** | View campaigns, manage own data, upload, export, publish |
| **Admin** | All regular user capabilities plus manage users, metadata schemas, pod bundles |

## Viewing user roles

1. Navigate to **Administration** > **User Roles**.
2. The page lists all users and their assigned roles.

## Assigning a role

1. Navigate to **Administration** > **User Roles**.
2. Click **Add User** or **Edit** next to an existing user.
3. Enter the **username** and select the **role**.
4. Save changes.

## Removing a role

1. Navigate to **Administration** > **User Roles**.
2. Click **Delete** next to the user role.
3. Confirm the action.

Removing a role reverts the user to default permissions (typically regular user access).

## Managing roles via SDK

Administrators can also manage roles programmatically:

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient(
    base_url="https://upstreamapi.pods.portals.tapis.io",
    username="admin-username",
    password="admin-password",
)

# List all roles
roles = client.list_user_roles()
for role in roles:
    print(f"{role['username']}: {role['role']}")

# Assign a role
client.upsert_user_role(username="new-user", role="admin")

# Delete a role
client.delete_user_role(username="former-admin")
```

## Managing roles via API

```bash
# List user roles
curl -H "Authorization: Bearer $TOKEN" \
  https://your-upstream-api.example.com/api/v1/user-roles

# Assign or update a role
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}' \
  https://your-upstream-api.example.com/api/v1/user-roles/{username}

# Delete a role
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  https://your-upstream-api.example.com/api/v1/user-roles/{username}
```
