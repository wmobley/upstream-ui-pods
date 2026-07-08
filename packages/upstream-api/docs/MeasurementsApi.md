# MeasurementsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createMeasurementApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsPost**](MeasurementsApi.md#createmeasurementapiv1campaignscampaignidstationsstationidsensorssensoridmeasurementspost) | **POST** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements | Create Measurement |
| [**deleteSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsDelete**](MeasurementsApi.md#deletesensormeasurementsapiv1campaignscampaignidstationsstationidsensorssensoridmeasurementsdelete) | **DELETE** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements | Delete Sensor Measurements |
| [**getMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGet**](MeasurementsApi.md#getmeasurementswithconfidenceintervalsapiv1campaignscampaignidstationsstationidsensorssensoridmeasurementsconfidenceintervalsget) | **GET** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements/confidence-intervals | Get Measurements With Confidence Intervals |
| [**getSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGet**](MeasurementsApi.md#getsensormeasurementsapiv1campaignscampaignidstationsstationidsensorssensoridmeasurementsget) | **GET** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements | Get Sensor Measurements |
| [**getSensorMeasurementsGeojsonApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGeojsonGet**](MeasurementsApi.md#getsensormeasurementsgeojsonapiv1campaignscampaignidstationsstationidsensorssensoridmeasurementsgeojsonget) | **GET** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements.geojson | Get Sensor Measurements Geojson |
| [**partialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPatch**](MeasurementsApi.md#partialupdatesensorapiv1campaignscampaignidstationsstationidsensorssensoridmeasurementsmeasurementidpatch) | **PATCH** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements/{measurement_id} | Partial Update Sensor |
| [**updateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPut**](MeasurementsApi.md#updatesensorapiv1campaignscampaignidstationsstationidsensorssensoridmeasurementsmeasurementidput) | **PUT** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}/measurements/{measurement_id} | Update Sensor |



## createMeasurementApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsPost

> MeasurementCreateResponse createMeasurementApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsPost(stationId, sensorId, campaignId, measurementIn, xTAPISTOKEN, authorization)

Create Measurement

### Example

```ts
import {
  Configuration,
  MeasurementsApi,
} from '';
import type { CreateMeasurementApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MeasurementsApi(config);

  const body = {
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // number
    campaignId: 56,
    // MeasurementIn
    measurementIn: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies CreateMeasurementApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsPostRequest;

  try {
    const data = await api.createMeasurementApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsPost(body);
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
| **measurementIn** | [MeasurementIn](MeasurementIn.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**MeasurementCreateResponse**](MeasurementCreateResponse.md)

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


## deleteSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsDelete

> deleteSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsDelete(campaignId, stationId, sensorId, xTAPISTOKEN, authorization)

Delete Sensor Measurements

### Example

```ts
import {
  Configuration,
  MeasurementsApi,
} from '';
import type { DeleteSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MeasurementsApi(config);

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
  } satisfies DeleteSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsDeleteRequest;

  try {
    const data = await api.deleteSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsDelete(body);
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


## getMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGet

> Array&lt;AggregatedMeasurement&gt; getMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGet(campaignId, stationId, sensorId, interval, intervalValue, startDate, endDate, minValue, maxValue, xTAPISTOKEN, authorization)

Get Measurements With Confidence Intervals

Get sensor measurements with confidence intervals for visualization.

### Example

```ts
import {
  Configuration,
  MeasurementsApi,
} from '';
import type { GetMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MeasurementsApi();

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // string | Time interval for aggregation (minute, hour, day) (optional)
    interval: interval_example,
    // number | Multiple of interval (e.g., 15 for 15-minute intervals) (optional)
    intervalValue: 56,
    // Date | Start date for filtering measurements (optional)
    startDate: 2013-10-20T19:20:30+01:00,
    // Date | End date for filtering measurements (optional)
    endDate: 2013-10-20T19:20:30+01:00,
    // number | Minimum measurement value to include (optional)
    minValue: 8.14,
    // number | Maximum measurement value to include (optional)
    maxValue: 8.14,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies GetMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGetRequest;

  try {
    const data = await api.getMeasurementsWithConfidenceIntervalsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsConfidenceIntervalsGet(body);
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
| **interval** | `string` | Time interval for aggregation (minute, hour, day) | [Optional] [Defaults to `&#39;hour&#39;`] |
| **intervalValue** | `number` | Multiple of interval (e.g., 15 for 15-minute intervals) | [Optional] [Defaults to `1`] |
| **startDate** | `Date` | Start date for filtering measurements | [Optional] [Defaults to `undefined`] |
| **endDate** | `Date` | End date for filtering measurements | [Optional] [Defaults to `undefined`] |
| **minValue** | `number` | Minimum measurement value to include | [Optional] [Defaults to `undefined`] |
| **maxValue** | `number` | Maximum measurement value to include | [Optional] [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;AggregatedMeasurement&gt;**](AggregatedMeasurement.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGet

> ListMeasurementsResponsePagination getSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGet(campaignId, stationId, sensorId, startDate, endDate, minMeasurementValue, maxMeasurementValue, limit, page, downsampleThreshold, xTAPISTOKEN, authorization)

Get Sensor Measurements

### Example

```ts
import {
  Configuration,
  MeasurementsApi,
} from '';
import type { GetSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MeasurementsApi();

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // Date (optional)
    startDate: 2013-10-20T19:20:30+01:00,
    // Date (optional)
    endDate: 2013-10-20T19:20:30+01:00,
    // number (optional)
    minMeasurementValue: 8.14,
    // number (optional)
    maxMeasurementValue: 8.14,
    // number (optional)
    limit: 56,
    // number (optional)
    page: 56,
    // number (optional)
    downsampleThreshold: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies GetSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGetRequest;

  try {
    const data = await api.getSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGet(body);
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
| **startDate** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **endDate** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **minMeasurementValue** | `number` |  | [Optional] [Defaults to `undefined`] |
| **maxMeasurementValue** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `1000`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **downsampleThreshold** | `number` |  | [Optional] [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ListMeasurementsResponsePagination**](ListMeasurementsResponsePagination.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSensorMeasurementsGeojsonApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGeojsonGet

> any getSensorMeasurementsGeojsonApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGeojsonGet(campaignId, stationId, sensorId, startDate, endDate, minMeasurementValue, maxMeasurementValue, limit, page, downsampleThreshold, xTAPISTOKEN, authorization)

Get Sensor Measurements Geojson

### Example

```ts
import {
  Configuration,
  MeasurementsApi,
} from '';
import type { GetSensorMeasurementsGeojsonApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGeojsonGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MeasurementsApi();

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // Date (optional)
    startDate: 2013-10-20T19:20:30+01:00,
    // Date (optional)
    endDate: 2013-10-20T19:20:30+01:00,
    // number (optional)
    minMeasurementValue: 8.14,
    // number (optional)
    maxMeasurementValue: 8.14,
    // number (optional)
    limit: 56,
    // number (optional)
    page: 56,
    // number (optional)
    downsampleThreshold: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies GetSensorMeasurementsGeojsonApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGeojsonGetRequest;

  try {
    const data = await api.getSensorMeasurementsGeojsonApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGeojsonGet(body);
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
| **startDate** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **endDate** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **minMeasurementValue** | `number` |  | [Optional] [Defaults to `undefined`] |
| **maxMeasurementValue** | `number` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `1000`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **downsampleThreshold** | `number` |  | [Optional] [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## partialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPatch

> MeasurementCreateResponse partialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPatch(campaignId, stationId, sensorId, measurementId, measurementUpdate, xTAPISTOKEN, authorization)

Partial Update Sensor

### Example

```ts
import {
  Configuration,
  MeasurementsApi,
} from '';
import type { PartialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MeasurementsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // number
    measurementId: 56,
    // MeasurementUpdate
    measurementUpdate: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies PartialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPatchRequest;

  try {
    const data = await api.partialUpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPatch(body);
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
| **measurementId** | `number` |  | [Defaults to `undefined`] |
| **measurementUpdate** | [MeasurementUpdate](MeasurementUpdate.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**MeasurementCreateResponse**](MeasurementCreateResponse.md)

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


## updateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPut

> MeasurementCreateResponse updateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPut(measurementId, stationId, sensorId, campaignId, measurementUpdate, xTAPISTOKEN, authorization)

Update Sensor

### Example

```ts
import {
  Configuration,
  MeasurementsApi,
} from '';
import type { UpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MeasurementsApi(config);

  const body = {
    // number
    measurementId: 56,
    // number
    stationId: 56,
    // number
    sensorId: 56,
    // number
    campaignId: 56,
    // MeasurementUpdate
    measurementUpdate: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies UpdateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPutRequest;

  try {
    const data = await api.updateSensorApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsMeasurementIdPut(body);
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
| **measurementId** | `number` |  | [Defaults to `undefined`] |
| **stationId** | `number` |  | [Defaults to `undefined`] |
| **sensorId** | `number` |  | [Defaults to `undefined`] |
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **measurementUpdate** | [MeasurementUpdate](MeasurementUpdate.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**MeasurementCreateResponse**](MeasurementCreateResponse.md)

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

