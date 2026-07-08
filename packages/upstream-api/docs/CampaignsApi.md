# CampaignsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createCampaignApiV1CampaignsPost**](CampaignsApi.md#createcampaignapiv1campaignspost) | **POST** /api/v1/campaigns | Create Campaign |
| [**deleteSensorApiV1CampaignsCampaignIdDelete**](CampaignsApi.md#deletesensorapiv1campaignscampaigniddelete) | **DELETE** /api/v1/campaigns/{campaign_id} | Delete Sensor |
| [**getCampaignApiV1CampaignsCampaignIdGet**](CampaignsApi.md#getcampaignapiv1campaignscampaignidget) | **GET** /api/v1/campaigns/{campaign_id} | Get Campaign |
| [**getCampaignPermissionsApiV1CampaignsCampaignIdPermissionsGet**](CampaignsApi.md#getcampaignpermissionsapiv1campaignscampaignidpermissionsget) | **GET** /api/v1/campaigns/{campaign_id}/permissions | Get Campaign Permissions |
| [**listCampaignsApiV1CampaignsGet**](CampaignsApi.md#listcampaignsapiv1campaignsget) | **GET** /api/v1/campaigns | List Campaigns |
| [**partialUpdateCampaignApiV1CampaignsCampaignIdPatch**](CampaignsApi.md#partialupdatecampaignapiv1campaignscampaignidpatch) | **PATCH** /api/v1/campaigns/{campaign_id} | Partial Update Campaign |
| [**publishCampaignApiV1CampaignsCampaignIdPublishPost**](CampaignsApi.md#publishcampaignapiv1campaignscampaignidpublishpost) | **POST** /api/v1/campaigns/{campaign_id}/publish | Publish Campaign |
| [**unpublishCampaignApiV1CampaignsCampaignIdUnpublishPost**](CampaignsApi.md#unpublishcampaignapiv1campaignscampaignidunpublishpost) | **POST** /api/v1/campaigns/{campaign_id}/unpublish | Unpublish Campaign |
| [**updateCampaignApiV1CampaignsCampaignIdPut**](CampaignsApi.md#updatecampaignapiv1campaignscampaignidput) | **PUT** /api/v1/campaigns/{campaign_id} | Update Campaign |



## createCampaignApiV1CampaignsPost

> CampaignCreateResponse createCampaignApiV1CampaignsPost(campaignsIn)

Create Campaign

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from '';
import type { CreateCampaignApiV1CampaignsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // CampaignsIn
    campaignsIn: ...,
  } satisfies CreateCampaignApiV1CampaignsPostRequest;

  try {
    const data = await api.createCampaignApiV1CampaignsPost(body);
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
| **campaignsIn** | [CampaignsIn](CampaignsIn.md) |  | |

### Return type

[**CampaignCreateResponse**](CampaignCreateResponse.md)

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


## deleteSensorApiV1CampaignsCampaignIdDelete

> deleteSensorApiV1CampaignsCampaignIdDelete(campaignId, xTAPISTOKEN, authorization)

Delete Sensor

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from '';
import type { DeleteSensorApiV1CampaignsCampaignIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    campaignId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies DeleteSensorApiV1CampaignsCampaignIdDeleteRequest;

  try {
    const data = await api.deleteSensorApiV1CampaignsCampaignIdDelete(body);
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


## getCampaignApiV1CampaignsCampaignIdGet

> GetCampaignResponse getCampaignApiV1CampaignsCampaignIdGet(campaignId)

Get Campaign

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from '';
import type { GetCampaignApiV1CampaignsCampaignIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    campaignId: 56,
  } satisfies GetCampaignApiV1CampaignsCampaignIdGetRequest;

  try {
    const data = await api.getCampaignApiV1CampaignsCampaignIdGet(body);
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

### Return type

[**GetCampaignResponse**](GetCampaignResponse.md)

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


## getCampaignPermissionsApiV1CampaignsCampaignIdPermissionsGet

> PermissionResponse getCampaignPermissionsApiV1CampaignsCampaignIdPermissionsGet(campaignId, xTAPISTOKEN, authorization)

Get Campaign Permissions

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from '';
import type { GetCampaignPermissionsApiV1CampaignsCampaignIdPermissionsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    campaignId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies GetCampaignPermissionsApiV1CampaignsCampaignIdPermissionsGetRequest;

  try {
    const data = await api.getCampaignPermissionsApiV1CampaignsCampaignIdPermissionsGet(body);
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

[**PermissionResponse**](PermissionResponse.md)

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


## listCampaignsApiV1CampaignsGet

> ListCampaignsResponsePagination listCampaignsApiV1CampaignsGet(page, limit, bbox, startDate, endDate, sensorVariables, xTAPISTOKEN, authorization)

List Campaigns

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from '';
import type { ListCampaignsApiV1CampaignsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
    // string | Bounding box of the campaign west,south,east,north (optional)
    bbox: bbox_example,
    // Date | Start date of the campaign (optional)
    startDate: 2024-01-01,
    // Date | End date of the campaign (optional)
    endDate: 2025-01-01,
    // Array<string> | List of sensor variables to filter by (optional)
    sensorVariables: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies ListCampaignsApiV1CampaignsGetRequest;

  try {
    const data = await api.listCampaignsApiV1CampaignsGet(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **bbox** | `string` | Bounding box of the campaign west,south,east,north | [Optional] [Defaults to `undefined`] |
| **startDate** | `Date` | Start date of the campaign | [Optional] [Defaults to `undefined`] |
| **endDate** | `Date` | End date of the campaign | [Optional] [Defaults to `undefined`] |
| **sensorVariables** | `Array<string>` | List of sensor variables to filter by | [Optional] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ListCampaignsResponsePagination**](ListCampaignsResponsePagination.md)

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


## partialUpdateCampaignApiV1CampaignsCampaignIdPatch

> CampaignCreateResponse partialUpdateCampaignApiV1CampaignsCampaignIdPatch(campaignId, campaignUpdate, xTAPISTOKEN, authorization)

Partial Update Campaign

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from '';
import type { PartialUpdateCampaignApiV1CampaignsCampaignIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    campaignId: 56,
    // CampaignUpdate
    campaignUpdate: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies PartialUpdateCampaignApiV1CampaignsCampaignIdPatchRequest;

  try {
    const data = await api.partialUpdateCampaignApiV1CampaignsCampaignIdPatch(body);
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
| **campaignUpdate** | [CampaignUpdate](CampaignUpdate.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**CampaignCreateResponse**](CampaignCreateResponse.md)

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


## publishCampaignApiV1CampaignsCampaignIdPublishPost

> PublishResponse publishCampaignApiV1CampaignsCampaignIdPublishPost(campaignId, xTAPISTOKEN, authorization, publishRequest)

Publish Campaign

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from '';
import type { PublishCampaignApiV1CampaignsCampaignIdPublishPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    campaignId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
    // PublishRequest (optional)
    publishRequest: ...,
  } satisfies PublishCampaignApiV1CampaignsCampaignIdPublishPostRequest;

  try {
    const data = await api.publishCampaignApiV1CampaignsCampaignIdPublishPost(body);
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


## unpublishCampaignApiV1CampaignsCampaignIdUnpublishPost

> PublishResponse unpublishCampaignApiV1CampaignsCampaignIdUnpublishPost(campaignId, xTAPISTOKEN, authorization, publishRequest)

Unpublish Campaign

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from '';
import type { UnpublishCampaignApiV1CampaignsCampaignIdUnpublishPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    campaignId: 56,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
    // PublishRequest (optional)
    publishRequest: ...,
  } satisfies UnpublishCampaignApiV1CampaignsCampaignIdUnpublishPostRequest;

  try {
    const data = await api.unpublishCampaignApiV1CampaignsCampaignIdUnpublishPost(body);
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


## updateCampaignApiV1CampaignsCampaignIdPut

> CampaignCreateResponse updateCampaignApiV1CampaignsCampaignIdPut(campaignId, campaignsIn, xTAPISTOKEN, authorization)

Update Campaign

### Example

```ts
import {
  Configuration,
  CampaignsApi,
} from '';
import type { UpdateCampaignApiV1CampaignsCampaignIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new CampaignsApi(config);

  const body = {
    // number
    campaignId: 56,
    // CampaignsIn
    campaignsIn: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies UpdateCampaignApiV1CampaignsCampaignIdPutRequest;

  try {
    const data = await api.updateCampaignApiV1CampaignsCampaignIdPut(body);
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
| **campaignsIn** | [CampaignsIn](CampaignsIn.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**CampaignCreateResponse**](CampaignCreateResponse.md)

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

