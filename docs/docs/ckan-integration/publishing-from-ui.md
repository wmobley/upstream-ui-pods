# Publishing from the UI

Use the web interface to publish campaign or station data to CKAN interactively.

## Publishing a campaign

1. Open the campaign page.
2. Click **Publish**.
3. Select the CKAN organization.
4. Optionally enable **Cascade** to publish all stations.
5. Optionally enable **Patch existing** to update an existing dataset.
6. Click **Confirm**.

<!-- TODO: Add GIF of UI publish workflow -->

## Publishing a station

1. Open the station dashboard.
2. Click **Publish**.
3. Review the publish dialog.
4. Click **Confirm**.

## Unpublishing

1. Open the campaign or station.
2. Click **Unpublish**.
3. Confirm the action.

## Publish options

| Option | Description |
| --- | ---|
| Cascade | Publish all child resources |
| Force | Publish even if parent is unpublished |
| Organization | CKAN organization to publish into |
| Custom dataset name | Override the default dataset name |
| Patch existing | Update existing dataset instead of failing |
