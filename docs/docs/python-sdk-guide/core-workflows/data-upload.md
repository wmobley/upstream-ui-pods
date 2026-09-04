# Data Upload

The SDK provides CSV upload functionality with automatic validation and chunking for large files.

## CSV format requirements

### Sensors CSV

```
alias,variablename,units,postprocess,postprocessscript
River Stage,River Stage,ft,false,
Rain Increment,Rain Increment,inches,false,
Flow Volume,Flow Volume,cfs,false,
```

### Measurements CSV

```
collectiontime,Lat_deg,Lon_deg,River Stage,Rain Increment,Flow Volume
2025-06-02 11:00:00,30.18611,-93.90833,4.6,0.0,10.3
2025-06-02 10:45:00,30.18611,-93.90833,4.6,0.0,10.3
```

## Uploading CSV files

### Simple upload

```python
result = client.upload_csv_data(
    campaign_id=123,
    station_id=456,
    sensors_file="sensors.csv",
    measurements_file="measurements.csv",
)
print(f"Upload result: {result}")
```

### Upload with chunking

For large files, use the chunked upload method:

```python
result = client.upload_chunked_csv_data(
    campaign_id=123,
    station_id=456,
    sensors_file="sensors.csv",
    measurements_file="large_measurements.csv",
)
print(f"Chunks uploaded: {result['chunks_uploaded']}")
```

### Upload using the direct method

```python
result = client.upload_sensor_measurement_files(
    campaign_id=123,
    station_id=456,
    sensors_file="sensors.csv",
    measurements_file="measurements.csv",
    chunk_size=1000,  # Lines per chunk
)
```

## Validating files without uploading

```python
result = client.validate_files(
    sensors_file="sensors.csv",
    measurements_file="measurements.csv",
)
print(f"Valid: {result['valid']}")
print(f"Sensors: {result['sensors_validation']}")
print(f"Measurements: {result['measurements_validation']}")
```

## Getting file information

```python
info = client.get_file_info("measurements.csv")
print(f"Size: {info['file_size_mb']} MB")
print(f"Rows: {info['row_count']}")
print(f"Needs chunking: {info['needs_chunking']}")
```

## Upload validation

The SDK validates files before upload:

- **Sensors CSV**: checks for required fields (`alias`, `variablename`, `units`)
- **Measurements CSV**: checks for required fields (`collectiontime`, `Lat_deg`, `Lon_deg`), validates coordinate ranges, and verifies timestamp format

Validation errors include row numbers so you can fix specific issues.

## Large file handling

For files larger than `max_chunk_size_mb` (default 50 MB):

1. The measurements CSV is automatically split into chunks
2. Each chunk is uploaded separately
3. The sensors CSV is uploaded with each chunk
4. Temporary chunk files are cleaned up after upload

## Timezone handling

- **Naive timestamps** (e.g., `2025-06-02 10:00:00`) are interpreted in the station's declared timezone
- **Timestamps with timezone** (e.g., `2025-06-02T10:00:00Z` or `2025-06-02T10:00:00-05:00`) pass through unchanged
