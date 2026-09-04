# Sensors CSV Format

The sensors CSV file defines what is being measured at a station.

## Required columns

| Column | Required | Type | Description |
| --- | --- | --- | --- |
| `alias` | Yes | string | Unique sensor name. Must exactly match a column header in the measurements CSV. |
| `variablename` | No | string | Human-readable description of the variable |
| `units` | No | string | Unit of measurement (e.g., `ft`, `cfs`, `inches`, `°C`) |
| `postprocess` | No | boolean | `true` or `false` — whether post-processing is needed |
| `postprocessscript` | No | string | Name of the post-processing script |

## Example

```csv
alias,variablename,units,postprocess
Rain Increment,Rain Increment,inches,false
Flow Volume,Flow Volume,cfs,false
River Stage,River Stage,ft,false
```

## Rules

- **Alias** must be unique within the file
- **Alias** is case-sensitive — `River Stage` and `river stage` are different
- **Alias** becomes the column header in the measurements CSV
- Use descriptive, consistent naming for aliases

## Common aliases

| Alias | Description |
| --- | --- |
| `River Stage` | Water level in feet |
| `Flow Volume` | Flow rate in cubic feet per second |
| `Rain Increment` | Rainfall in inches |
| `Temperature` | Air temperature in °C |
| `Humidity` | Relative humidity in % |
