# MetadataSchemaApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createMetadataSchemaApiV1MetadataSchemaPost**](MetadataSchemaApi.md#createmetadataschemaapiv1metadataschemapost) | **POST** /api/v1/metadata-schema | Create Metadata Schema |
| [**deleteMetadataSchemaApiV1MetadataSchemaSchemaIdDelete**](MetadataSchemaApi.md#deletemetadataschemaapiv1metadataschemaschemaiddelete) | **DELETE** /api/v1/metadata-schema/{schema_id} | Delete Metadata Schema |
| [**getMetadataSchemaApiV1MetadataSchemaSchemaIdGet**](MetadataSchemaApi.md#getmetadataschemaapiv1metadataschemaschemaidget) | **GET** /api/v1/metadata-schema/{schema_id} | Get Metadata Schema |
| [**listMetadataSchemaApiV1MetadataSchemaGet**](MetadataSchemaApi.md#listmetadataschemaapiv1metadataschemaget) | **GET** /api/v1/metadata-schema | List Metadata Schema |
| [**updateMetadataSchemaApiV1MetadataSchemaSchemaIdPatch**](MetadataSchemaApi.md#updatemetadataschemaapiv1metadataschemaschemaidpatch) | **PATCH** /api/v1/metadata-schema/{schema_id} | Update Metadata Schema |



## createMetadataSchemaApiV1MetadataSchemaPost

> MetadataSchemaResponse createMetadataSchemaApiV1MetadataSchemaPost(metadataSchemaCreate)

Create Metadata Schema

### Example

```ts
import {
  Configuration,
  MetadataSchemaApi,
} from '';
import type { CreateMetadataSchemaApiV1MetadataSchemaPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MetadataSchemaApi(config);

  const body = {
    // MetadataSchemaCreate
    metadataSchemaCreate: ...,
  } satisfies CreateMetadataSchemaApiV1MetadataSchemaPostRequest;

  try {
    const data = await api.createMetadataSchemaApiV1MetadataSchemaPost(body);
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
| **metadataSchemaCreate** | [MetadataSchemaCreate](MetadataSchemaCreate.md) |  | |

### Return type

[**MetadataSchemaResponse**](MetadataSchemaResponse.md)

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


## deleteMetadataSchemaApiV1MetadataSchemaSchemaIdDelete

> deleteMetadataSchemaApiV1MetadataSchemaSchemaIdDelete(schemaId)

Delete Metadata Schema

### Example

```ts
import {
  Configuration,
  MetadataSchemaApi,
} from '';
import type { DeleteMetadataSchemaApiV1MetadataSchemaSchemaIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MetadataSchemaApi(config);

  const body = {
    // number
    schemaId: 56,
  } satisfies DeleteMetadataSchemaApiV1MetadataSchemaSchemaIdDeleteRequest;

  try {
    const data = await api.deleteMetadataSchemaApiV1MetadataSchemaSchemaIdDelete(body);
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
| **schemaId** | `number` |  | [Defaults to `undefined`] |

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


## getMetadataSchemaApiV1MetadataSchemaSchemaIdGet

> MetadataSchemaResponse getMetadataSchemaApiV1MetadataSchemaSchemaIdGet(schemaId)

Get Metadata Schema

### Example

```ts
import {
  Configuration,
  MetadataSchemaApi,
} from '';
import type { GetMetadataSchemaApiV1MetadataSchemaSchemaIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MetadataSchemaApi(config);

  const body = {
    // number
    schemaId: 56,
  } satisfies GetMetadataSchemaApiV1MetadataSchemaSchemaIdGetRequest;

  try {
    const data = await api.getMetadataSchemaApiV1MetadataSchemaSchemaIdGet(body);
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
| **schemaId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**MetadataSchemaResponse**](MetadataSchemaResponse.md)

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


## listMetadataSchemaApiV1MetadataSchemaGet

> MetadataSchemaListResponse listMetadataSchemaApiV1MetadataSchemaGet(scope, activeOnly)

List Metadata Schema

### Example

```ts
import {
  Configuration,
  MetadataSchemaApi,
} from '';
import type { ListMetadataSchemaApiV1MetadataSchemaGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MetadataSchemaApi(config);

  const body = {
    // string | Filter by scope (campaign, station, sensor) (optional)
    scope: scope_example,
    // boolean | Return only active schema entries (optional)
    activeOnly: true,
  } satisfies ListMetadataSchemaApiV1MetadataSchemaGetRequest;

  try {
    const data = await api.listMetadataSchemaApiV1MetadataSchemaGet(body);
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
| **scope** | `string` | Filter by scope (campaign, station, sensor) | [Optional] [Defaults to `undefined`] |
| **activeOnly** | `boolean` | Return only active schema entries | [Optional] [Defaults to `true`] |

### Return type

[**MetadataSchemaListResponse**](MetadataSchemaListResponse.md)

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


## updateMetadataSchemaApiV1MetadataSchemaSchemaIdPatch

> MetadataSchemaResponse updateMetadataSchemaApiV1MetadataSchemaSchemaIdPatch(schemaId, metadataSchemaUpdate)

Update Metadata Schema

### Example

```ts
import {
  Configuration,
  MetadataSchemaApi,
} from '';
import type { UpdateMetadataSchemaApiV1MetadataSchemaSchemaIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MetadataSchemaApi(config);

  const body = {
    // number
    schemaId: 56,
    // MetadataSchemaUpdate
    metadataSchemaUpdate: ...,
  } satisfies UpdateMetadataSchemaApiV1MetadataSchemaSchemaIdPatchRequest;

  try {
    const data = await api.updateMetadataSchemaApiV1MetadataSchemaSchemaIdPatch(body);
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
| **schemaId** | `number` |  | [Defaults to `undefined`] |
| **metadataSchemaUpdate** | [MetadataSchemaUpdate](MetadataSchemaUpdate.md) |  | |

### Return type

[**MetadataSchemaResponse**](MetadataSchemaResponse.md)

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

