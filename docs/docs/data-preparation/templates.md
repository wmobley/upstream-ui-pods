# CSV Templates

Use these templates as starting points for your data files.

## Sensors CSV template

```csv
alias,variablename,units,postprocess,postprocessscript
```

### Minimal example

```csv
alias,variablename,units,postprocess
Temperature,Temperature,celsius,false
Humidity,Relative Humidity,percent,false
```

### Full example

```csv
alias,variablename,units,postprocess,postprocessscript
River Stage,River Stage,ft,false,
Flow Volume,Flow Volume,cfs,false,
Rain Increment,Rain Increment,inches,false,
Temperature,Air Temperature,celsius,false,
Humidity,Relative Humidity,percent,false,
```

## Measurements CSV template

```csv
collectiontime,Lat_deg,Lon_deg,Temperature,Humidity
```

### Minimal example

```csv
collectiontime,Lat_deg,Lon_deg,Temperature,Humidity
2025-06-02 10:00:00,30.18611,-93.90833,25.5,65.2
2025-06-02 10:15:00,30.18611,-93.90833,25.8,64.8
```

### Full example

```csv
collectiontime,Lat_deg,Lon_deg,River Stage,Flow Volume,Rain Increment,Temperature,Humidity
2025-06-02 10:00:00,30.18611,-93.90833,4.6,10.3,0.0,25.5,65.2
2025-06-02 10:15:00,30.18611,-93.90833,4.7,10.5,0.0,25.8,64.8
2025-06-02 10:30:00,30.18611,-93.90833,4.6,10.6,0.0,26.1,64.5
```

## Example files in the repository

Upstream includes example CSV files:

- `upstream-ui/public/examples/data/sensors.csv`
- `upstream-ui/public/examples/data/measurements.csv`

These are also accessible from the upload dialog in the web UI.
