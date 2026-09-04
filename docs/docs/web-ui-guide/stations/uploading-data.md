# Uploading Data to a Station

Uploading data to a station requires two CSV files: a **sensors CSV** defining what is measured, and a **measurements CSV** containing the actual observations.

## Upload steps

1. Open the station dashboard.
2. Click **Upload Data**.
3. Select your **sensors CSV** file.
4. Select your **measurements CSV** file.
5. The upload dialog validates your files before submitting.
6. Review any warnings or errors.
7. Click **Upload** to submit.

!!! note "Walkthrough GIF planned"
    Add `../../assets/gifs/upload-data.gif` here after recording the upload dialog and validation workflow.

    ```markdown
    ![Uploading station data](../../assets/gifs/upload-data.gif)
    ```

## CSV format requirements

### Sensors CSV

| Column | Required | Description |
| --- | --- | --- |
| `alias` | Yes | Unique sensor name. Must exactly match a column in the measurements CSV. |
| `variablename` | No | Human-readable variable name |
| `units` | No | Unit of measurement (e.g., `ft`, `cfs`, `inches`) |
| `postprocess` | No | `true` or `false` |
| `postprocessscript` | No | Optional script reference |

Example:

```csv
alias,variablename,units,postprocess
Rain Increment,Rain Increment,inches,false
Flow Volume,Flow Volume,cfs,false
River Stage,River Stage,ft,false
```

### Measurements CSV

| Column | Required | Description |
| --- | --- | --- |
| `collectiontime` | Yes | ISO 8601 timestamp. Naive values are interpreted in the station timezone. |
| `Lat_deg` | Yes | Latitude in decimal degrees |
| `Lon_deg` | Yes | Longitude in decimal degrees |
| One column per sensor alias | Yes | Column names must exactly match sensor aliases. Blank cells are skipped. |

Example:

```csv
collectiontime,Lat_deg,Lon_deg,River Stage,Rain Increment,Flow Volume
2025-06-02 11:00:00,30.18611,-93.90833,4.6,0.0,10.3
2025-06-02 10:45:00,30.18611,-93.90833,4.6,0.0,10.3
```

## Validation

The upload dialog validates your files before submission. Common validation checks:

- Required columns are present
- Sensor aliases match between files
- Latitude is between -90 and 90
- Longitude is between -180 and 180
- Timestamps are in a valid format
- File encoding is UTF-8

If validation fails, the dialog shows specific errors with row numbers so you can fix your CSV files.

## Large files

For very large CSV files, the upload may be split into chunks automatically. The upload dialog shows progress as each chunk is processed.

## Example files

The upload dialog includes links to example CSV files. You can also find them in the Upstream repository under `upstream-ui/public/examples/data/`.

## Troubleshooting

| Issue | Possible cause | Fix |
| --- | --- | --- |
| **Alias mismatch** | Sensor aliases don't match between files | Ensure column names in measurements CSV exactly match aliases in sensors CSV |
| **Invalid timestamp** | Timestamp format not recognized | Use ISO 8601 format: `YYYY-MM-DD HH:MM:SS` or `YYYY-MM-DDTHH:MM:SSZ` |
| **Coordinates out of range** | Latitude or longitude values invalid | Check that Lat_deg is -90 to 90 and Lon_deg is -180 to 180 |
| **Duplicate data** | Rows with same timestamp and location | Duplicates are skipped; no action needed |
