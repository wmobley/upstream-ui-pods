# Sensor Variables API

## List sensor variables

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://your-api.example.com/api/v1/sensor_variables
```

Returns a list of available sensor variable names in the system. These are standardized variable names that can be used when defining sensors.
