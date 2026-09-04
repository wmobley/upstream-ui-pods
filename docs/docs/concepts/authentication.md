# Authentication

Upstream uses Tapis authentication for the deployed UI and API. After you sign in, the UI forwards your token to the API so your permissions can be checked for each campaign, station, sensor, and publishing action.

## In the web UI

1. Open the Upstream site.
2. Select **Sign in with Tapis**.
3. Complete the Tapis login flow.
4. Return to Upstream and choose the project instance you want to work with, if prompted.

If your session expires, sign in again before uploading, editing, exporting restricted data, or publishing to CKAN.

## In scripts or API calls

Pass your Tapis token as a bearer token:

```bash
Authorization: Bearer <token>
```

Some CKAN publishing flows may also forward the token as:

```bash
X-TAPIS-TOKEN: <token>
```

## Common issues

- **401 Unauthorized** — your token is missing, invalid, or expired.
- **403 Forbidden** — you are signed in but do not have the role required for that action.
- **Publishing unavailable** — publishing requires write permission and, for CKAN operations, a usable Tapis token.
