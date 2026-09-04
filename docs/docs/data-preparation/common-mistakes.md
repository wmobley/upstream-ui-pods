# Common Mistakes

Avoid these common errors when preparing CSV files for upload.

## 1. Alias mismatch between files

**Problem:** The sensor alias in the sensors CSV does not match the column header in the measurements CSV.

**Wrong:**
```csv
# sensors.csv
alias,variablename,units
river_stage,River Stage,ft

# measurements.csv
collectiontime,Lat_deg,Lon_deg,River Stage
```

**Correct:**
```csv
# sensors.csv
alias,variablename,units
River Stage,River Stage,ft

# measurements.csv
collectiontime,Lat_deg,Lon_deg,River Stage
```

## 2. Case-sensitive column names

**Problem:** Column names are case-sensitive.

**Wrong:**
```csv
# sensors.csv
alias: "river stage"

# measurements.csv
column: "River Stage"  # Does not match!
```

**Correct:** Use the exact same spelling and capitalization.

## 3. Missing required columns

**Problem:** Sensors CSV missing `alias`, `variablename`, or `units`. Measurements CSV missing `collectiontime`, `Lat_deg`, or `Lon_deg`.

**Fix:** Ensure all required columns are present.

## 4. Invalid coordinates

**Problem:** Latitude or longitude values out of range.

**Wrong:**
```csv
collectiontime,Lat_deg,Lon_deg
2025-06-02 10:00:00,91.0,-93.9  # Latitude > 90
```

**Correct:**
```csv
collectiontime,Lat_deg,Lon_deg
2025-06-02 10:00:00,30.186,-93.908
```

## 5. Wrong file encoding

**Problem:** File is not UTF-8 encoded (e.g., saved as Latin-1 or Windows-1252).

**Fix:** Save your CSV as UTF-8. Most spreadsheet applications support UTF-8 export.

## 6. Extra whitespace in column names

**Problem:** Column names have leading or trailing spaces.

**Wrong:**
```csv
collectiontime,Lat_deg,Lon_deg, River Stage
```

**Correct:**
```csv
collectiontime,Lat_deg,Lon_deg,River Stage
```

## 7. Using the wrong timezone

**Problem:** Station timezone does not match where the station is located, causing timestamps to be off by hours.

**Fix:** Set the station timezone to the timezone where the station is physically located, not your local timezone.

## 8. Uploading to the wrong station

**Problem:** Data uploaded to a station with a different timezone or location.

**Fix:** Double-check the campaign and station before uploading.
