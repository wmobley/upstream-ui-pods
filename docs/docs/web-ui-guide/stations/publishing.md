# Publishing Station Data

You can publish individual station data to CKAN without publishing the entire campaign.

## Publishing a station

1. Open the station dashboard.
2. Click **Publish**.
3. Review the publish dialog:
    - Select the CKAN **organization**.
    - Optionally override the default **dataset name**.
    - Choose whether to **cascade** — publishing all sensors within the station.
4. Click **Confirm**.

## Unpublishing a station

1. Open the station dashboard.
2. Click **Unpublish**.
3. Confirm the action.

## What gets published

When a station is published, Upstream creates or updates a CKAN dataset containing:

- **Sensors CSV resource** — sensor configuration metadata
- **Measurements CSV resource** — measurement data
- **Dataset extras** — station metadata including name, description, geometry, and sensor count

## Cascade behavior

When cascade is enabled:

- Publishing a station also publishes all its sensors
- Publishing a campaign also publishes all its stations (and optionally their sensors)

When cascade is disabled:

- Only the specific resource is published
- Child resources remain unpublished

## Patch existing datasets

If a CKAN dataset with the same name already exists, you can:

- Enable **patch existing** to update the existing dataset instead of failing
- Provide a custom **CKAN dataset name** to create a separate dataset

## Next steps

- [CKAN dataset structure](../../ckan-integration/dataset-structure.md) for details on what gets created
- [Publishing from SDK](../../ckan-integration/publishing-from-sdk.md) for scripted workflows
- [Troubleshooting CKAN](../../ckan-integration/troubleshooting.md) for common issues
