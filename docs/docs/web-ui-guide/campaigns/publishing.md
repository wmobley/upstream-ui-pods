# Publishing Campaigns to CKAN

Publishing makes your campaign data discoverable in a public CKAN data portal. You can publish entire campaigns or individual stations.

## Publishing from the UI

### Publish a campaign

1. Open the campaign page.
2. Click **Publish**.
3. Review the publish dialog:
    - Select the CKAN **organization** to publish into.
    - Optionally override the default dataset name.
    - Choose whether to **cascade** — publishing all stations within the campaign.
4. Click **Confirm**.

!!! note "Walkthrough GIF planned"
    Add `../../assets/gifs/publish-to-ckan.gif` here after recording the CKAN publish dialog workflow.

    ```markdown
    ![Publishing to CKAN](../../assets/gifs/publish-to-ckan.gif)
    ```

### Publish a station

1. Open the station page within a campaign.
2. Click **Publish**.
3. Review and confirm the publish dialog.

### Unpublish

To remove published data from CKAN:

1. Open the campaign or station.
2. Click **Unpublish**.
3. Confirm the action.

## Publish behavior

| Option | Description |
| --- | --- |
| **Cascade** | When publishing a campaign, cascade the publish to all child stations and sensors |
| **Force** | Publish even if the parent resource (campaign/station) is not yet published |
| **Organization** | The CKAN organization that will own the published dataset |
| **Patch existing** | Update an existing CKAN dataset instead of failing on name conflict |

## What gets published

When you publish a station, Upstream creates or updates a CKAN dataset containing:

- **Sensors CSV resource** — sensor configuration and metadata
- **Measurements CSV resource** — measurement data
- **Dataset metadata** — campaign and station details as CKAN extras

## Dataset naming

Published datasets follow the naming convention:

```
upstream-campaign-{campaign_id}
```

If a dataset with that name already exists, you can:

- Use **patch existing** to update it
- Provide a custom **CKAN dataset name** to avoid conflicts

## Troubleshooting

| Issue | Possible cause | Fix |
| --- | --- | --- |
| **Publish fails** | Missing CKAN organization | Ensure you have a valid organization configured |
| **Name conflict** | Dataset already exists in CKAN | Use patch existing or provide a custom name |
| **Authentication error** | Tapis token expired | Sign in again and retry |
| **Permission denied** | Insufficient CKAN permissions | Contact your administrator |

## Next steps

- [Publishing from SDK](../../ckan-integration/publishing-from-sdk.md) for scripted workflows
- [Publishing from API](../../ckan-integration/publishing-from-api.md) for direct HTTP access
- [CKAN dataset structure](../../ckan-integration/dataset-structure.md) for details on what gets created
