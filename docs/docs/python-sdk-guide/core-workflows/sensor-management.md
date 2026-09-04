# Sensor Management

The SDK provides sensor operations through the `SensorManager`.

## Listing sensors

```python
sensors = client.sensors.list(campaign_id=123, station_id=456)

for sensor in sensors.items:
    print(f"{sensor.id}: {sensor.alias} — {sensor.variablename} ({sensor.units})")
```

## Getting a sensor

```python
sensor = client.sensors.get(
    sensor_id=789,
    station_id=456,
    campaign_id=123,
)

print(f"Alias: {sensor.alias}")
print(f"Variable: {sensor.variablename}")
print(f"Units: {sensor.units}")
```

## Updating a sensor

```python
from upstream_api_client.models import SensorUpdate

update = SensorUpdate(
    variablename="River Stage (Updated)",
    units="feet",
)

updated = client.sensors.update(
    sensor_id=789,
    station_id=456,
    campaign_id=123,
    sensor_update=update,
)
```

## Deleting a sensor

```python
client.sensors.delete(
    sensor_id=789,
    station_id=456,
    campaign_id=123,
)
```

## Publishing a sensor

```python
result = client.publish_sensor(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
    organization="upstream",
)
```

## Updating statistics

```python
# Update statistics for all sensors in a station
client.sensors.force_update_statistics(
    campaign_id=123,
    station_id=456,
)

# Update statistics for a single sensor
client.sensors.force_update_single_sensor_statistics(
    campaign_id=123,
    station_id=456,
    sensor_id=789,
)
```

## Listing sensor variables

```python
variables = client.sensor_variables.list()
for var in variables:
    print(var)
```
