# Authentication

Upstream uses Tapis OAuth2 for authentication. You need a Tapis account to sign in.

## Signing in

1. Open your Upstream instance in a browser.
2. Click **Sign in with Tapis**.
3. Complete the Tapis login flow (username/password or institutional SSO).
4. You will be redirected to the Upstream campaigns dashboard.

<!-- TODO: Add GIF of sign-in flow -->

## Session behavior

- Tokens are stored in browser storage and persist across page refreshes.
- If your session expires, you will be prompted to sign in again before performing actions that require authentication (upload, export, publish, administration).

## Permissions and roles

Your Tapis identity determines what you can do in Upstream:

| Role | Capabilities |
| --- | --- |
| Regular user | View campaigns you have access to, upload data to your stations, export data |
| Admin | All regular user capabilities plus manage users, metadata schemas, pod bundles, and system settings |

Campaign-level permissions control who can view, edit, or publish individual campaigns and their stations.

## Common authentication issues

| Issue | Cause | Fix |
| --- | --- | --- |
| **401 Unauthorized** | Token is missing, invalid, or expired | Sign in again |
| **403 Forbidden** | Signed in but lacking required role | Ask an admin to grant permissions |
| **Publishing unavailable** | CKAN publishing requires a valid Tapis token | Ensure your session is active and you have publish permissions |
