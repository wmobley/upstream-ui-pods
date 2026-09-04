# Campaign Management

The SDK provides full campaign lifecycle management through the `CampaignManager`.

## Listing campaigns

```python
campaigns = client.campaigns.list(limit=50, page=1)

for campaign in campaigns.items:
    print(f"{campaign.id}: {campaign.name}")
    print(f"  Description: {campaign.description}")
```

## Getting a campaign

```python
campaign = client.campaigns.get(campaign_id=123)

print(f"Name: {campaign.name}")
print(f"Description: {campaign.description}")
print(f"Stations: {len(campaign.stations)}")
```

## Creating a campaign

```python
from upstream_api_client.models import CampaignsIn

campaign_data = CampaignsIn(
    name="Summer 2025 Field Campaign",
    description="Environmental monitoring during summer IOP",
    contact_name="Jane Smith",
    contact_email="jane@example.com",
)

campaign = client.campaigns.create(campaign_data)
print(f"Created campaign: {campaign.id}")
```

## Updating a campaign

```python
from upstream_api_client.models import CampaignUpdate

update = CampaignUpdate(
    name="Summer 2025 Field Campaign - Updated",
    description="Updated description",
)

updated = client.campaigns.update(campaign_id=123, campaign_update=update)
```

## Deleting a campaign

```python
client.campaigns.delete(campaign_id=123)
```

!!! warning "Deleting a campaign"
    This removes all stations, sensors, and measurements within the campaign.

## Publishing a campaign

```python
result = client.publish_campaign(
    campaign_id=123,
    cascade=True,        # Publish all stations too
    force=False,         # Don't force if parent is unpublished
    organization="upstream",
)
print(f"Published: {result}")
```

## Unpublishing a campaign

```python
result = client.unpublish_campaign(
    campaign_id=123,
    cascade=True,
)
```

## Getting campaign permissions

```python
permissions = client.campaigns.get_permissions(campaign_id=123)
print(permissions)
```
