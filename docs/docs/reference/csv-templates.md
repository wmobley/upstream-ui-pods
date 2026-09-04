# CSV Templates

Downloadable template files for data upload.

## Sensors CSV template

```csv
alias,variablename,units,postprocess
River Stage,River Stage,ft,false
Rain Increment,Rain Increment,inches,false
Flow Volume,Flow Volume,cfs,false
```

## Measurements CSV template

```csv
collectiontime,Lat_deg,Lon_deg,River Stage,Rain Increment,Flow Volume
2025-06-02 11:00:00,30.18611,-93.90833,4.6,0.0,10.3
2025-06-02 10:45:00,30.18611,-93.90833,4.6,0.0,10.3
2025-06-02 10:30:00,30.18611,-93.90833,4.6,0.0,10.6
2025-06-02 10:15:00,30.18611,-93.90833,4.6,0.0,10.6
2025-06-02 10:00:00,30.18611,-93.90833,4.6,0.0,10.4
```

## Example files in the repository

The Upstream repository includes example CSV files:

- `upstream-ui/public/examples/data/sensors.csv`
- `upstream-ui/public/examples/data/measurements.csv`

These are also accessible from the upload dialog in the web UI.

## Creating your own

1. Start with the templates above
2. Replace the sensor aliases with your own variable names
3. Add your measurement data with timestamps and coordinates
4. Ensure column names match exactly between files
