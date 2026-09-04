# Publishing from the SDK

Use the Python SDK for scripted and automated CKAN publishing.

## Basic publish

```python
from upstream_sdk import UpstreamClient

client = UpstreamClient.from_environment()

# Publish a station
result = client.publish_station(
    campaign_id=123,
    station_id=456,
    cascade=True,
    organization="upstream",
)
print(f"Published: {result}")
```

## Publish with custom dataset name

```python
result = client.publish_station(
    campaign_id=123,
    station_id=456,
    organization="upstream",
    ckan_dataset_name="my-custom-name",
    patch_existing_ckan_dataset=True,
)
```

## Publish a campaign

```python
result = client.publish_campaign(
    campaign_id=123,
    cascade=True,
    organization="upstream",
)
```

## Unpublish

```python
client.unpublish_station(campaign_id=123, station_id=456, cascade=True)
client.unpublish_campaign(campaign_id=123, cascade=True)
```

## Using the direct CKAN integration

For more control over metadata:

```python
from upstream_sdk import CKANIntegration

ckan = CKANIntegration(
    ckan_url="https://ckan.tacc.utexas.edu",
    config={"api_key": "your-ckan-api-key"},
)

dataset = ckan.create_dataset(
    name="my-dataset",
    title="My Dataset",
    organization="upstream",
)

ckan.create_resource(
    dataset_id=dataset["id"],
    name="Data",
    file_path="data.csv",
    format="CSV",
)
```
