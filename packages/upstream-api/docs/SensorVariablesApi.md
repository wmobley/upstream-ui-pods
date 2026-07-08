# SensorVariablesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**listSensorVariablesApiV1SensorVariablesGet**](SensorVariablesApi.md#listsensorvariablesapiv1sensorvariablesget) | **GET** /api/v1/sensor_variables | List Sensor Variables |



## listSensorVariablesApiV1SensorVariablesGet

> Array&lt;string | null&gt; listSensorVariablesApiV1SensorVariablesGet()

List Sensor Variables

### Example

```ts
import {
  Configuration,
  SensorVariablesApi,
} from '';
import type { ListSensorVariablesApiV1SensorVariablesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorVariablesApi(config);

  try {
    const data = await api.listSensorVariablesApiV1SensorVariablesGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**Array<string | null>**

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

