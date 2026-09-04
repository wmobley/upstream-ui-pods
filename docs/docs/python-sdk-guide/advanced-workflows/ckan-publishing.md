# CKAN Publishing

The SDK supports publishing Upstream data to CKAN through the API publish endpoint or the direct CKAN integration.

## Publishing via the API (recommended)

The simplest approach uses the Upstream API publish endpoint:

```python
result = client.publish_station(
    campaign_id=123,
    station_id=456,
    cascade=True,
    organization="upstream",
    tapis_token="your-tapis-jwt",
)
print(f"Published to CKAN: {result}")
```

### Publish options

| Parameter | Description |
| --- | --- |
| `cascade` | Publish all child resources (sensors for stations) |
| `force` | Publish even if parent is unpublished |
| `organization` | CKAN organization to publish into |
| `ckan_dataset_name` | Custom dataset name (overrides default) |
| `patch_existing_ckan_dataset` | Update existing dataset instead of failing on name conflict |

### Publishing a campaign

```python
result = client.publish_campaign(
    campaign_id=123,
    cascade=True,
    organization="upstream",
)
```

### Unpublishing

```python
# Unpublish a station
result = client.unpublish_station(
    campaign_id=123,
    station_id=456,
    cascade=True,
)

# Unpublish a campaign
result = client.unpublish_campaign(
    campaign_id=123,
    cascade=True,
)
```

## Publishing via direct CKAN integration

For more control over CKAN metadata, use the `CKANIntegration` class directly:

```python
from upstream_sdk import CKANIntegration

ckan = CKANIntegration(
    ckan_url="https://ckan.tacc.utexas.edu",
    config={"api_key": "your-ckan-api-key"},
)

# Create a dataset
dataset = ckan.create_dataset(
    name="my-campaign-data",
    title="My Campaign Data",
    description="Environmental sensor data from field campaign",
    organization="upstream",
    tags=["environmental", "sensors"],
)

# Upload resources
ckan.create_resource(
    dataset_id=dataset["id"],
    name="Sensors Configuration",
    file_path="sensors.csv",
    format="CSV",
)

ckan.create_resource(
    dataset_id=dataset["id"],
    name="Measurement Data",
    file_path="measurements.csv",
    format="CSV",
)
```

## What gets published

When publishing through the API, Upstream creates or updates:

- A CKAN dataset with campaign/station metadata as extras
- A sensors CSV resource
- A measurements CSV resource

## Listing CKAN organizations

```python
orgs = client.list_ckan_organizations()
for org in orgs:
    print(f"{org['name']}: {org['title']}")
```

## Troubleshooting

| Issue | Fix |
| --- | --- |
| **Organization required** | Set `CKAN_ORGANIZATION` or pass `organization` parameter |
| **Name conflict** | Use `patch_existing_ckan_dataset=True` or provide custom name |
| **Token expired** | Re-authenticate and pass a fresh Tapis token |
| **CKAN API key invalid** | Verify your CKAN API key is valid |
