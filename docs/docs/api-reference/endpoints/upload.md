# Upload API

The upload endpoint accepts multipart form data with two CSV files.

## Upload CSV files

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "upload_file_sensors=@sensors.csv" \
  -F "upload_file_measurements=@measurements.csv" \
  https://your-api.example.com/api/v1/uploadfile_csv/campaign/{campaign_id}/station/{station_id}/sensor
```

## Form fields

| Field | Type | Description |
| --- | --- | --- |
| `upload_file_sensors` | file | Sensors CSV file |
| `upload_file_measurements` | file | Measurements CSV file |

## Sensors CSV format

```
alias,variablename,units,postprocess,postprocessscript
River Stage,River Stage,ft,false,
Rain Increment,Rain Increment,inches,false,
```

| Column | Required | Description |
| --- | --- | --- |
| `alias` | Yes | Unique sensor name |
| `variablename` | No | Human-readable variable name |
| `units` | No | Unit of measurement |
| `postprocess` | No | Post-processing flag |
| `postprocessscript` | No | Script reference |

## Measurements CSV format

```
collectiontime,Lat_deg,Lon_deg,River Stage,Rain Increment
2025-06-02 11:00:00,30.18611,-93.90833,4.6,0.0
2025-06-02 10:45:00,30.18611,-93.90833,4.6,0.0
```

| Column | Required | Description |
| --- | --- | --- |
| `collectiontime` | Yes | ISO 8601 timestamp |
| `Lat_deg` | Yes | Latitude (-90 to 90) |
| `Lon_deg` | Yes | Longitude (-180 to 180) |
| Sensor columns | Yes | Must match sensor aliases exactly |

## Timezone handling

- **Naive timestamps** (e.g., `2025-06-02 10:00:00`) are interpreted in the station's declared timezone
- **Timestamps with timezone** (e.g., `2025-06-02T10:00:00Z`) pass through unchanged

## Validation errors

The API validates files before processing. Errors include:

- Missing required columns
- Invalid coordinate values
- Unrecognized timestamp formats
- Alias mismatches between files
- Invalid file encoding (must be UTF-8)

## Response

On success, the API returns processing results including:

- Number of measurements processed
- Number of sensors created/updated
- Any warnings or skipped rows
