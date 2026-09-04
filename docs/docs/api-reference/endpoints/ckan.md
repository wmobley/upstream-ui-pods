# CKAN API

Endpoints for CKAN integration.

## List CKAN organizations

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/ckan/organizations
```

Returns the list of CKAN organizations available for publishing.

## Publish to CKAN

Publishing is done through the campaign and station publish endpoints:

```bash
# Publish a station
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

See [Campaigns API](campaigns.md) and [Stations API](stations.md) for full publish/unpublish details.
