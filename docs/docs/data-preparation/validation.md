# Validation

Upstream validates your CSV files before processing. Understanding the validation rules helps you prepare correct files.

## Sensors CSV validation

| Rule | Description |
| --- | --- |
| Required columns | `alias`, `variablename`, `units` must be present |
| Alias format | Must be a non-empty string |
| Units format | Must be a string if present |

## Measurements CSV validation

| Rule | Description |
| --- | --- |
| Required columns | `collectiontime`, `Lat_deg`, `Lon_deg` must be present |
| Latitude range | Must be between -90 and 90 |
| Longitude range | Must be between -180 and 180 |
| Timestamp format | Must be a valid string (ISO 8601 recommended) |
| Sensor columns | Each sensor alias from sensors CSV must appear as a column |
| Column matching | Column names must exactly match sensor aliases (case-sensitive) |

## Validation in the SDK

Validate files without uploading:

```python
result = client.validate_files(
    sensors_file="sensors.csv",
    measurements_file="measurements.csv",
)
print(result)
```

## Validation in the UI

The upload dialog validates files automatically and shows:

- Specific errors with row numbers
- Warnings for potential issues
- A summary of what will be uploaded

## Common validation errors

| Error | Cause | Fix |
| --- | --- | --- |
| `Missing required field 'alias'` | Sensors CSV missing alias column | Add the alias column |
| `Latitude must be between -90 and 90` | Invalid latitude value | Check coordinate values |
| `Column 'X' not found in sensors` | Alias mismatch | Ensure column names match exactly |
| `Invalid timestamp` | Unrecognized format | Use ISO 8601 format |
