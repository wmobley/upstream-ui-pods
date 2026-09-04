# Managing Sensors

A **sensor** (or variable) represents a measured quantity at a station. Sensors are defined in the sensors CSV file and uploaded along with measurements.

## Sensor properties

Each sensor has:

| Property | Description |
| --- | --- |
| **alias** | Unique name used in CSV files and data access (e.g., `River Stage`) |
| **variablename** | Human-readable description (e.g., `River Stage`) |
| **units** | Unit of measurement (e.g., `ft`, `cfs`, `inches`) |
| **postprocess** | Boolean flag for post-processing |
| **postprocessscript** | Optional script reference |

## Viewing sensors

The station dashboard lists all sensors with their aliases, variable names, and units. Click a sensor to see its measurements and visualizations.

## Editing sensors

1. Open the station dashboard.
2. Select a sensor from the list.
3. Click **Edit** to update properties like variable name or units.
4. Save changes.

## Deleting sensors

1. Select a sensor from the station dashboard.
2. Click **Delete**.
3. Confirm the action.

!!! warning "Deleting sensors"
    Deleting a sensor also removes all associated measurements. This action cannot be undone.

## Sensor statistics

Upstream automatically computes statistics for each sensor, including:

- Minimum and maximum values
- Average (mean)
- Standard deviation
- Percentiles
- Measurement count

These statistics are updated when data is uploaded. You can also trigger a manual recalculation.

See [Sensor statistics](statistics.md) for details.

## Next steps

- [Sensor statistics](statistics.md) for details on computed statistics
- [Visualization](visualization.md) for exploring sensor data in charts and maps
