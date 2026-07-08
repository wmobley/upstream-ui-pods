# CkanApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**debugCkanAuthApiV1CkanDebugAuthGet**](CkanApi.md#debugckanauthapiv1ckandebugauthget) | **GET** /api/v1/ckan/debug/auth | Debug Ckan Auth |
| [**listUserOrganizationsApiV1CkanOrganizationsGet**](CkanApi.md#listuserorganizationsapiv1ckanorganizationsget) | **GET** /api/v1/ckan/organizations | List User Organizations |



## debugCkanAuthApiV1CkanDebugAuthGet

> { [key: string]: any; } debugCkanAuthApiV1CkanDebugAuthGet(xTAPISTOKEN, authorization)

Debug Ckan Auth

### Example

```ts
import {
  Configuration,
  CkanApi,
} from '';
import type { DebugCkanAuthApiV1CkanDebugAuthGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CkanApi();

  const body = {
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies DebugCkanAuthApiV1CkanDebugAuthGetRequest;

  try {
    const data = await api.debugCkanAuthApiV1CkanDebugAuthGet(body);
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
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

**{ [key: string]: any; }**

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


## listUserOrganizationsApiV1CkanOrganizationsGet

> Array&lt;{ [key: string]: any; }&gt; listUserOrganizationsApiV1CkanOrganizationsGet(xTAPISTOKEN, authorization)

List User Organizations

### Example

```ts
import {
  Configuration,
  CkanApi,
} from '';
import type { ListUserOrganizationsApiV1CkanOrganizationsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CkanApi();

  const body = {
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies ListUserOrganizationsApiV1CkanOrganizationsGetRequest;

  try {
    const data = await api.listUserOrganizationsApiV1CkanOrganizationsGet(body);
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
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

**Array<{ [key: string]: any; }>**

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

