# API Authentication

The Upstream API uses Tapis OAuth2 for authentication.

## Obtaining a token

### Via the token endpoint

```bash
curl -X POST \
  -d "username=your-username" \
  -d "password=your-password" \
  -d "grant_type=password" \
  https://your-upstream-api.example.com/api/v1/token
```

Response:

```json
{
  "access_token": "eyJ...",
  "tapis_access_token": "eyJ...",
  "expires_in": 3600,
  "username": "your-username",
  "role": "user"
}
```

### Via Tapis directly

For production use, obtain a token from the Tapis OAuth2 endpoint:

```bash
curl -X POST \
  -d "username=your-username" \
  -d "password=your-password" \
  -d "grant_type=password" \
  https://tapis.io/v3/oauth2/token
```

## Using the token

Pass the token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer eyJ..." \
  https://your-upstream-api.example.com/api/v1/campaigns
```

For CKAN publishing, also pass the Tapis token:

```bash
curl -H "Authorization: Bearer eyJ..." \
  -H "X-TAPIS-TOKEN: eyJ..." \
  https://your-upstream-api.example.com/api/v1/campaigns/123/publish
```

## Token expiration

- Tokens expire after `expires_in` seconds (typically 3600)
- Check token validity before making requests
- Re-authenticate when you receive a `401` response

## Common authentication errors

| Code | Cause | Fix |
| --- | --- | --- |
| `401` | Missing or invalid token | Re-authenticate and obtain a new token |
| `401` | Expired token | Re-authenticate |
| `403` | Insufficient permissions | Check your role and campaign permissions |
