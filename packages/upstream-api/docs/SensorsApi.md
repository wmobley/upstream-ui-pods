# SensorsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteSensorApiV1CampaignsCampaignIdStationsStationIdSensorsDelete**](SensorsApi.md#deletesensorapiv1campaignscampaignidstationsstationidsensorsdelete) | **DELETE** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors | Delete Sensor |
| [**deleteSensorSensorIdApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdDelete**](SensorsApi.md#deletesensorsensoridapiv1campaignscampaignidstationsstationidsensorssensoriddelete) | **DELETE** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id} | Delete Sensor Sensor Id |
| [**forceUpdateSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsStatisticsPost**](SensorsApi.md#forceupdatesensorstatisticsapiv1campaignscampaignidstationsstationidsensorsstatisticspost) | **POST** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/statistics | Force Update Sensor Statistics |
| [**forceUpdateSingleSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdStatisticsPost**](SensorsApi.md#forceupdatesinglesensorstatisticsapiv1campaignscampaignidstationsstationidsensorssensoridstatisticspost) | **POST** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/statistics | Force Update Single Sensor Statistics |
| [**getSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdGet**](SensorsApi.md#getsensorapiv1campaignscampaignidstationsstationidsensorssensoridget) | **GET** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id} | Get Sensor |
| [**listSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGet**](SensorsApi.md#listsensorsapiv1campaignscampaignidstationsstationidsensorsget) | **GET** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors | List Sensors |
| [**partialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPatch**](SensorsApi.md#partialupdatesensorapiv1campaignscampaignidstationsstationidsensorssensoridpatch) | **PATCH** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id} | Partial Update Sensor |
| [**publishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPublishPost**](SensorsApi.md#publishsensorapiv1campaignscampaignidstationsstationidsensorssensoridpublishpost) | **POST** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/publish | Publish Sensor |
| [**unpublishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdUnpublishPost**](SensorsApi.md#unpublishsensorapiv1campaignscampaignidstationsstationidsensorssensoridunpublishpost) | **POST** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/unpublish | Unpublish Sensor |
| [**updateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPut**](SensorsApi.md#updatesensorapiv1campaignscampaignidstationsstationidsensorssensoridput) | **PUT** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id} | Update Sensor |



## deleteSensorApiV1CampaignsCampaignIdStationsStationIdSensorsDelete

> deleteSensorApiV1CampaignsCampaignIdStationsStationIdSensorsDelete(campaignId, stationId, xTAPISTOKEN, authorization)

Delete Sensor

### Example

```ts
import {
  Configuration,
  SensorsApi,
} from '';
import type { DeleteSensorApiV1CampaignsCampaignIdStationsStationIdSensorsDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies DeleteSensorApiV1CampaignsCampaignIdStationsStationIdSensorsDeleteRequest;

  try {
    const data = await api.deleteSensorApiV1CampaignsCampaignIdStationsStationIdSensorsDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteSensorSensorIdApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdDelete

> deleteSensorSensorIdApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdDelete(campaignId, stationId, sensorId, xTAPISTOKEN, authorization)

Delete Sensor Sensor Id

### Example

```ts
import {
  Configuration,
  SensorsApi,
} from '';
import type { DeleteSensorSensorIdApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies DeleteSensorSensorIdApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdDeleteRequest;

  try {
    const data = await api.deleteSensorSensorIdApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **sensorId** | `number` |  | [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## forceUpdateSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsStatisticsPost

> ForceUpdateSensorStatisticsResponse forceUpdateSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsStatisticsPost(campaignId, stationId, xTAPISTOKEN, authorization)

Force Update Sensor Statistics

Force update sensor statistics for all sensors in the station

### Example

```ts
import {
  Configuration,
  SensorsApi,
} from '';
import type { ForceUpdateSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsStatisticsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies ForceUpdateSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsStatisticsPostRequest;

  try {
    const data = await api.forceUpdateSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsStatisticsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ForceUpdateSensorStatisticsResponse**](ForceUpdateSensorStatisticsResponse.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## forceUpdateSingleSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdStatisticsPost

> UpdateSensorStatisticsResponse forceUpdateSingleSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdStatisticsPost(campaignId, stationId, sensorId, xTAPISTOKEN, authorization)

Force Update Single Sensor Statistics

Force update sensor statistics for a single sensor

### Example

```ts
import {
  Configuration,
  SensorsApi,
} from '';
import type { ForceUpdateSingleSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdStatisticsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies ForceUpdateSingleSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdStatisticsPostRequest;

  try {
    const data = await api.forceUpdateSingleSensorStatisticsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdStatisticsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **sensorId** | `number` |  | [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdateSensorStatisticsResponse**](UpdateSensorStatisticsResponse.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdGet

> GetSensorResponse getSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdGet(stationId, sensorId, campaignId, xTAPISTOKEN, authorization)

Get Sensor

### Example

```ts
import {
  Configuration,
  SensorsApi,
} from '';
import type { GetSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorsApi(config);

  const body = {
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // number
    campaignId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies GetSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdGetRequest;

  try {
    const data = await api.getSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **sensorId** | `number` |  | [Defaults to `undefined`] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**GetSensorResponse**](GetSensorResponse.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGet

> ListSensorsResponsePagination listSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGet(campaignId, stationId, page, limit, variableName, units, alias, descriptionContains, postprocess, sortBy, sortOrder, xTAPISTOKEN, authorization)

List Sensors

### Example

```ts
import {
  Configuration,
  SensorsApi,
} from '';
import type { ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
    // string | Filter sensors by variable name (partial match) (optional)
    variableName: variableName_example,
    // string | Filter sensors by units (exact match) (optional)
    units: units_example,
    // string | Filter sensors by alias (partial match) (optional)
    alias: alias_example,
    // string | Filter sensors by text in description (partial match) (optional)
    descriptionContains: descriptionContains_example,
    // boolean | Filter sensors by postprocess flag (optional)
    postprocess: true,
    // SortField | Sort sensors by field (optional)
    sortBy: ...,
    // string | Sort order (asc or desc) (optional)
    sortOrder: sortOrder_example,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest;

  try {
    const data = await api.listSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **variableName** | `string` | Filter sensors by variable name (partial match) | [Optional] [Defaults to `undefined`] |
| **units** | `string` | Filter sensors by units (exact match) | [Optional] [Defaults to `undefined`] |
| **alias** | `string` | Filter sensors by alias (partial match) | [Optional] [Defaults to `undefined`] |
| **descriptionContains** | `string` | Filter sensors by text in description (partial match) | [Optional] [Defaults to `undefined`] |
| **postprocess** | `boolean` | Filter sensors by postprocess flag | [Optional] [Defaults to `undefined`] |
| **sortBy** | `SortField` | Sort sensors by field | [Optional] [Defaults to `undefined`] [Enum: alias, description, postprocess, postprocessscript, units, variablename, max_value, min_value, avg_value, stddev_value, percentile_90, percentile_95, percentile_99, count, first_measurement_value, first_measurement_collectiontime, last_measurement_value, last_measurement_collectiontime] |
| **sortOrder** | `string` | Sort order (asc or desc) | [Optional] [Defaults to `&#39;asc&#39;`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ListSensorsResponsePagination**](ListSensorsResponsePagination.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## partialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPatch

> SensorCreateResponse partialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPatch(campaignId, stationId, sensorId, sensorUpdate, xTAPISTOKEN, authorization)

Partial Update Sensor

### Example

```ts
import {
  Configuration,
  SensorsApi,
} from '';
import type { PartialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // SensorUpdate
    sensorUpdate: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies PartialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPatchRequest;

  try {
    const data = await api.partialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPatch(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **sensorId** | `number` |  | [Defaults to `undefined`] |
| **sensorUpdate** | [SensorUpdate](SensorUpdate.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**SensorCreateResponse**](SensorCreateResponse.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## publishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPublishPost

> PublishResponse publishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPublishPost(campaignId, stationId, sensorId, xTAPISTOKEN, authorization, publishRequest)

Publish Sensor

### Example

```ts
import {
  Configuration,
  SensorsApi,
} from '';
import type { PublishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPublishPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
    // PublishRequest (optional)
    publishRequest: ...,
  } satisfies PublishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPublishPostRequest;

  try {
    const data = await api.publishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPublishPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **sensorId** | `number` |  | [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |
| **publishRequest** | [PublishRequest](PublishRequest.md) |  | [Optional] |

### Return type

[**PublishResponse**](PublishResponse.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## unpublishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdUnpublishPost

> PublishResponse unpublishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdUnpublishPost(campaignId, stationId, sensorId, xTAPISTOKEN, authorization, publishRequest)

Unpublish Sensor

### Example

```ts
import {
  Configuration,
  SensorsApi,
} from '';
import type { UnpublishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdUnpublishPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
    // PublishRequest (optional)
    publishRequest: ...,
  } satisfies UnpublishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdUnpublishPostRequest;

  try {
    const data = await api.unpublishSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdUnpublishPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **sensorId** | `number` |  | [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |
| **publishRequest** | [PublishRequest](PublishRequest.md) |  | [Optional] |

### Return type

[**PublishResponse**](PublishResponse.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPut

> SensorCreateResponse updateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPut(sensorId, stationId, campaignId, sensorUpdate, xTAPISTOKEN, authorization)

Update Sensor

### Example

```ts
import {
  Configuration,
  SensorsApi,
} from '';
import type { UpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new SensorsApi(config);

  const body = {
    // number
    sensorId: 56,
    // number
    stationId: 56,
    // number
    campaignId: 56,
    // SensorUpdate
    sensorUpdate: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies UpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPutRequest;

  try {
    const data = await api.updateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdPut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sensorId** | `number` |  | [Defaults to `undefined`] |
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **sensorUpdate** | [SensorUpdate](SensorUpdate.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**SensorCreateResponse**](SensorCreateResponse.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

