# StationsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createStationApiV1CampaignsCampaignIdStationsPost**](StationsApi.md#createstationapiv1campaignscampaignidstationspost) | **POST** /api/v1/campaigns/{campaign_id}/stations | Create Station |
| [**deleteSensorApiV1CampaignsCampaignIdStationsDelete**](StationsApi.md#deletesensorapiv1campaignscampaignidstationsdelete) | **DELETE** /api/v1/campaigns/{campaign_id}/stations | Delete Sensor |
| [**deleteStationApiV1CampaignsCampaignIdStationsStationIdDelete**](StationsApi.md#deletestationapiv1campaignscampaignidstationsstationiddelete) | **DELETE** /api/v1/campaigns/{campaign_id}/stations/{station_id} | Delete Station |
| [**exportMeasurementsCsvApiV1CampaignsCampaignIdStationsStationIdMeasurementsExportGet**](StationsApi.md#exportmeasurementscsvapiv1campaignscampaignidstationsstationidmeasurementsexportget) | **GET** /api/v1/campaigns/{campaign_id}/stations/{station_id}/measurements/export | Export Measurements Csv |
| [**exportSensorsCsvApiV1CampaignsCampaignIdStationsStationIdSensorsExportGet**](StationsApi.md#exportsensorscsvapiv1campaignscampaignidstationsstationidsensorsexportget) | **GET** /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/export | Export Sensors Csv |
| [**getStationApiV1CampaignsCampaignIdStationsStationIdGet**](StationsApi.md#getstationapiv1campaignscampaignidstationsstationidget) | **GET** /api/v1/campaigns/{campaign_id}/stations/{station_id} | Get Station |
| [**listStationsApiV1CampaignsCampaignIdStationsGet**](StationsApi.md#liststationsapiv1campaignscampaignidstationsget) | **GET** /api/v1/campaigns/{campaign_id}/stations | List Stations |
| [**partialUpdateStationApiV1CampaignsCampaignIdStationsStationIdPatch**](StationsApi.md#partialupdatestationapiv1campaignscampaignidstationsstationidpatch) | **PATCH** /api/v1/campaigns/{campaign_id}/stations/{station_id} | Partial Update Station |
| [**publishStationApiV1CampaignsCampaignIdStationsStationIdPublishPost**](StationsApi.md#publishstationapiv1campaignscampaignidstationsstationidpublishpost) | **POST** /api/v1/campaigns/{campaign_id}/stations/{station_id}/publish | Publish Station |
| [**unpublishStationApiV1CampaignsCampaignIdStationsStationIdUnpublishPost**](StationsApi.md#unpublishstationapiv1campaignscampaignidstationsstationidunpublishpost) | **POST** /api/v1/campaigns/{campaign_id}/stations/{station_id}/unpublish | Unpublish Station |
| [**updateStationApiV1CampaignsCampaignIdStationsStationIdPut**](StationsApi.md#updatestationapiv1campaignscampaignidstationsstationidput) | **PUT** /api/v1/campaigns/{campaign_id}/stations/{station_id} | Update Station |



## createStationApiV1CampaignsCampaignIdStationsPost

> StationCreateResponse createStationApiV1CampaignsCampaignIdStationsPost(campaignId, stationCreate, xTAPISTOKEN, authorization)

Create Station

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { CreateStationApiV1CampaignsCampaignIdStationsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    campaignId: 56,
    // StationCreate
    stationCreate: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies CreateStationApiV1CampaignsCampaignIdStationsPostRequest;

  try {
    const data = await api.createStationApiV1CampaignsCampaignIdStationsPost(body);
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
| **stationCreate** | [StationCreate](StationCreate.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**StationCreateResponse**](StationCreateResponse.md)

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


## deleteSensorApiV1CampaignsCampaignIdStationsDelete

> deleteSensorApiV1CampaignsCampaignIdStationsDelete(campaignId, xTAPISTOKEN, authorization)

Delete Sensor

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { DeleteSensorApiV1CampaignsCampaignIdStationsDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    campaignId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies DeleteSensorApiV1CampaignsCampaignIdStationsDeleteRequest;

  try {
    const data = await api.deleteSensorApiV1CampaignsCampaignIdStationsDelete(body);
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


## deleteStationApiV1CampaignsCampaignIdStationsStationIdDelete

> deleteStationApiV1CampaignsCampaignIdStationsStationIdDelete(stationId, campaignId, xTAPISTOKEN, authorization)

Delete Station

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { DeleteStationApiV1CampaignsCampaignIdStationsStationIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    stationId: 56,
    // number
    campaignId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies DeleteStationApiV1CampaignsCampaignIdStationsStationIdDeleteRequest;

  try {
    const data = await api.deleteStationApiV1CampaignsCampaignIdStationsStationIdDelete(body);
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
| **campaignId** | `number` |  | [Defaults to `undefined`] |
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


## exportMeasurementsCsvApiV1CampaignsCampaignIdStationsStationIdMeasurementsExportGet

> any exportMeasurementsCsvApiV1CampaignsCampaignIdStationsStationIdMeasurementsExportGet(campaignId, stationId, startDate, endDate, xTAPISTOKEN, authorization)

Export Measurements Csv

Export measurements for a station as CSV with streaming support.

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { ExportMeasurementsCsvApiV1CampaignsCampaignIdStationsStationIdMeasurementsExportGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // Date | Start date filter (optional)
    startDate: 2013-10-20T19:20:30+01:00,
    // Date | End date filter (optional)
    endDate: 2013-10-20T19:20:30+01:00,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies ExportMeasurementsCsvApiV1CampaignsCampaignIdStationsStationIdMeasurementsExportGetRequest;

  try {
    const data = await api.exportMeasurementsCsvApiV1CampaignsCampaignIdStationsStationIdMeasurementsExportGet(body);
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
| **startDate** | `Date` | Start date filter | [Optional] [Defaults to `undefined`] |
| **endDate** | `Date` | End date filter | [Optional] [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

**any**

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


## exportSensorsCsvApiV1CampaignsCampaignIdStationsStationIdSensorsExportGet

> any exportSensorsCsvApiV1CampaignsCampaignIdStationsStationIdSensorsExportGet(campaignId, stationId, xTAPISTOKEN, authorization)

Export Sensors Csv

Export sensors for a station as CSV with streaming support.

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { ExportSensorsCsvApiV1CampaignsCampaignIdStationsStationIdSensorsExportGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies ExportSensorsCsvApiV1CampaignsCampaignIdStationsStationIdSensorsExportGetRequest;

  try {
    const data = await api.exportSensorsCsvApiV1CampaignsCampaignIdStationsStationIdSensorsExportGet(body);
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

**any**

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


## getStationApiV1CampaignsCampaignIdStationsStationIdGet

> GetStationResponse getStationApiV1CampaignsCampaignIdStationsStationIdGet(stationId, campaignId, xTAPISTOKEN, authorization)

Get Station

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { GetStationApiV1CampaignsCampaignIdStationsStationIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    stationId: 56,
    // number
    campaignId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies GetStationApiV1CampaignsCampaignIdStationsStationIdGetRequest;

  try {
    const data = await api.getStationApiV1CampaignsCampaignIdStationsStationIdGet(body);
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
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**GetStationResponse**](GetStationResponse.md)

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


## listStationsApiV1CampaignsCampaignIdStationsGet

> ListStationsResponsePagination listStationsApiV1CampaignsCampaignIdStationsGet(campaignId, page, limit, xTAPISTOKEN, authorization)

List Stations

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { ListStationsApiV1CampaignsCampaignIdStationsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies ListStationsApiV1CampaignsCampaignIdStationsGetRequest;

  try {
    const data = await api.listStationsApiV1CampaignsCampaignIdStationsGet(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ListStationsResponsePagination**](ListStationsResponsePagination.md)

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


## partialUpdateStationApiV1CampaignsCampaignIdStationsStationIdPatch

> StationCreateResponse partialUpdateStationApiV1CampaignsCampaignIdStationsStationIdPatch(campaignId, stationId, stationUpdate, xTAPISTOKEN, authorization)

Partial Update Station

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { PartialUpdateStationApiV1CampaignsCampaignIdStationsStationIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // StationUpdate
    stationUpdate: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies PartialUpdateStationApiV1CampaignsCampaignIdStationsStationIdPatchRequest;

  try {
    const data = await api.partialUpdateStationApiV1CampaignsCampaignIdStationsStationIdPatch(body);
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
| **stationUpdate** | [StationUpdate](StationUpdate.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**StationCreateResponse**](StationCreateResponse.md)

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


## publishStationApiV1CampaignsCampaignIdStationsStationIdPublishPost

> PublishResponse publishStationApiV1CampaignsCampaignIdStationsStationIdPublishPost(campaignId, stationId, xTAPISTOKEN, authorization, publishRequest)

Publish Station

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { PublishStationApiV1CampaignsCampaignIdStationsStationIdPublishPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
    // PublishRequest (optional)
    publishRequest: ...,
  } satisfies PublishStationApiV1CampaignsCampaignIdStationsStationIdPublishPostRequest;

  try {
    const data = await api.publishStationApiV1CampaignsCampaignIdStationsStationIdPublishPost(body);
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


## unpublishStationApiV1CampaignsCampaignIdStationsStationIdUnpublishPost

> PublishResponse unpublishStationApiV1CampaignsCampaignIdStationsStationIdUnpublishPost(campaignId, stationId, xTAPISTOKEN, authorization)

Unpublish Station

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { UnpublishStationApiV1CampaignsCampaignIdStationsStationIdUnpublishPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies UnpublishStationApiV1CampaignsCampaignIdStationsStationIdUnpublishPostRequest;

  try {
    const data = await api.unpublishStationApiV1CampaignsCampaignIdStationsStationIdUnpublishPost(body);
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

[**PublishResponse**](PublishResponse.md)

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


## updateStationApiV1CampaignsCampaignIdStationsStationIdPut

> StationCreateResponse updateStationApiV1CampaignsCampaignIdStationsStationIdPut(stationId, campaignId, stationUpdate, xTAPISTOKEN, authorization)

Update Station

### Example

```ts
import {
  Configuration,
  StationsApi,
} from '';
import type { UpdateStationApiV1CampaignsCampaignIdStationsStationIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new StationsApi(config);

  const body = {
    // number
    stationId: 56,
    // number
    campaignId: 56,
    // StationUpdate
    stationUpdate: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies UpdateStationApiV1CampaignsCampaignIdStationsStationIdPutRequest;

  try {
    const data = await api.updateStationApiV1CampaignsCampaignIdStationsStationIdPut(body);
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
| **campaignId** | `number` |  | [Defaults to `undefined`] |
| **stationUpdate** | [StationUpdate](StationUpdate.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**StationCreateResponse**](StationCreateResponse.md)

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

