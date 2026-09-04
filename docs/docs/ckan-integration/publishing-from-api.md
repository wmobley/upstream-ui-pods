# Publishing from the API

Use the REST API for direct CKAN publishing.

## Publish a station

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-TAPIS-TOKEN: your-tapis-jwt" \
  -d '{
    "cascade": true,
    "organization": "upstream",
    "patch_existing_ckan_dataset": false
  }' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/publish
```

## Publish a campaign

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cascade": true,
    "organization": "upstream"
  }' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/publish
```

## Unpublish

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/stations/{station_id}/unpublish
```

## List CKAN organizations

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/ckan/organizations
```
