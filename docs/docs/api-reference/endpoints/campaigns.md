# Campaigns API

## List campaigns

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://your-api.example.com/api/v1/campaigns?limit=50&page=1"
```

**Response:**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Summer 2025 Campaign",
      "description": "Environmental monitoring",
      "contact_name": "Jane Smith",
      "contact_email": "jane@example.com",
      "allocation": "NSF-12345"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50,
  "pages": 1
}
```

## Create a campaign

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Campaign",
    "description": "Campaign description",
    "contact_name": "Contact Name",
    "contact_email": "contact@example.com"
  }' \
  https://your-api.example.com/api/v1/campaigns
```

**Response:** `201 Created`

## Get a campaign

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}
```

## Update a campaign

```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}
```

## Delete a campaign

```bash
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}
```

!!! warning "Deleting a campaign removes all stations, sensors, and measurements."

## Publish a campaign

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cascade": true,
    "force": false,
    "organization": "upstream"
  }' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/publish
```

## Unpublish a campaign

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cascade": true}' \
  https://your-api.example.com/api/v1/campaigns/{campaign_id}/unpublish
```
