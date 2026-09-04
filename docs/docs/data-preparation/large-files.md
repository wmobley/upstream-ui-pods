# Large Files

Upstream handles large CSV files through automatic chunking.

## File size limits

| Limit | Value |
| --- | ---|
| Maximum file size | 500 MB per file |
| Default chunk size | 10,000 rows per chunk |
| Maximum chunk size | 50 MB |

## Automatic chunking

When you upload a large measurements CSV:

1. The file is split into chunks of `chunk_size` rows
2. Each chunk is uploaded separately with the sensors file
3. Temporary chunk files are cleaned up after upload
4. Progress is reported for each chunk

## SDK upload methods

### Simple upload (small files)

```python
result = client.upload_csv_data(
    campaign_id=123,
    station_id=456,
    sensors_file="sensors.csv",
    measurements_file="measurements.csv",
)
```

### Chunked upload (large files)

```python
result = client.upload_chunked_csv_data(
    campaign_id=123,
    station_id=456,
    sensors_file="sensors.csv",
    measurements_file="large_measurements.csv",
)
```

### Custom chunk size

```python
result = client.upload_sensor_measurement_files(
    campaign_id=123,
    station_id=456,
    sensors_file="sensors.csv",
    measurements_file="measurements.csv",
    chunk_size=500,  # 500 rows per chunk
)
```

## Check file before upload

```python
info = client.get_file_info("measurements.csv")
print(f"Size: {info['file_size_mb']} MB")
print(f"Rows: {info['row_count']}")
print(f"Needs chunking: {info['needs_chunking']}")
```

## Tips for large uploads

1. **Use chunked upload** — `upload_chunked_csv_data` handles large files automatically
2. **Ensure stable connection** — chunked uploads make multiple requests
3. **Monitor progress** — the SDK logs each chunk upload
4. **Validate first** — check for errors before uploading large files
