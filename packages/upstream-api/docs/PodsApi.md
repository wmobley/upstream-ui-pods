# PodsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createPodBundleApiV1PodsBundlePost**](PodsApi.md#createpodbundleapiv1podsbundlepost) | **POST** /api/v1/pods/bundle | Create Pod Bundle |



## createPodBundleApiV1PodsBundlePost

> { [key: string]: any; } createPodBundleApiV1PodsBundlePost(bundleRequest, xTAPISTOKEN, authorization)

Create Pod Bundle

Create a Postgres/API/UI pod bundle using server-side credentials.

### Example

```ts
import {
  Configuration,
  PodsApi,
} from '';
import type { CreatePodBundleApiV1PodsBundlePostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new PodsApi(config);

  const body = {
    // BundleRequest
    bundleRequest: ...,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies CreatePodBundleApiV1PodsBundlePostRequest;

  try {
    const data = await api.createPodBundleApiV1PodsBundlePost(body);
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
| **bundleRequest** | [BundleRequest](BundleRequest.md) |  | |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

**{ [key: string]: any; }**

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

