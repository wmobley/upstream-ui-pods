# CKAN Troubleshooting

Common issues when publishing to CKAN.

## Dataset already exists

**Error:** `CKAN dataset creation failed: Name already exists`

**Fix:** Use `patch_existing_ckan_dataset=true` to update the existing dataset, or provide a custom `ckan_dataset_name`.

## Organization not found

**Error:** `Organization is required`

**Fix:** Ensure you have specified a valid CKAN organization. List available organizations:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/ckan/organizations
```

## Authentication failed

**Error:** `401 Unauthorized` or `403 Forbidden`

**Fix:** Ensure your Tapis token is valid and included in the `X-TAPIS-TOKEN` header. Re-authenticate if needed.

## Solr field size error

**Error:** Document exceeds Solr field size limit

**Fix:** This typically happens with very large metadata objects. Upstream automatically truncates large values, but if you encounter this, reduce the size of custom metadata fields.

## Publishing hangs or times out

**Cause:** Large datasets may take time to process.

**Fix:** Be patient for large uploads. If the issue persists, try publishing individual stations instead of entire campaigns.

## Published data not visible

**Check:**

1. Is the dataset private? Published datasets should be public.
2. Is the CKAN portal caching results? Try a hard refresh.
3. Does your CKAN user have permission to view the organization's datasets?
