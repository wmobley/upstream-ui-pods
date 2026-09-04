# Data Preparation

Prepare your data as two CSV files before uploading to Upstream.

## The two files

### Sensors CSV

Defines what is being measured. Each row is a sensor (or variable).

### Measurements CSV

Contains the actual observations. Each row is one measurement with a timestamp, coordinates, and values for each sensor.

## Upload flow

```
Field observations → CSV files → Upstream UI or SDK → API → Database
```

## Quick checklist

Before uploading, verify:

- [ ] Both CSV files are UTF-8 encoded
- [ ] Sensors CSV has `alias`, `variablename`, `units` columns
- [ ] Measurements CSV has `collectiontime`, `Lat_deg`, `Lon_deg` columns
- [ ] Each sensor alias from sensors CSV appears as a column in measurements CSV
- [ ] Column names match exactly (case-sensitive)
- [ ] Timestamps are in ISO 8601 format
- [ ] Latitude is between -90 and 90
- [ ] Longitude is between -180 and 180
- [ ] Blank values are acceptable (they are skipped)

## Guides

| Topic | Page |
| --- | --- |
| Sensors CSV format | [Sensors CSV](sensors-csv.md) |
| Measurements CSV format | [Measurements CSV](measurements-csv.md) |
| Timezone handling | [Timezone handling](timezone-handling.md) |
| Validation rules | [Validation](validation.md) |
| Large files | [Large files](large-files.md) |
| Templates | [Templates](templates.md) |
| Common mistakes | [Common mistakes](common-mistakes.md) |
