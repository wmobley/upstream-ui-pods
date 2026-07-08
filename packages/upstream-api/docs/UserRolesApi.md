# UserRolesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteUserRoleApiV1UserRolesUsernameDelete**](UserRolesApi.md#deleteuserroleapiv1userrolesusernamedelete) | **DELETE** /api/v1/user-roles/{username} | Delete User Role |
| [**listUserRolesApiV1UserRolesGet**](UserRolesApi.md#listuserrolesapiv1userrolesget) | **GET** /api/v1/user-roles | List User Roles |
| [**upsertUserRoleApiV1UserRolesUsernamePut**](UserRolesApi.md#upsertuserroleapiv1userrolesusernameput) | **PUT** /api/v1/user-roles/{username} | Upsert User Role |



## deleteUserRoleApiV1UserRolesUsernameDelete

> deleteUserRoleApiV1UserRolesUsernameDelete(username)

Delete User Role

### Example

```ts
import {
  Configuration,
  UserRolesApi,
} from '';
import type { DeleteUserRoleApiV1UserRolesUsernameDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UserRolesApi(config);

  const body = {
    // string
    username: username_example,
  } satisfies DeleteUserRoleApiV1UserRolesUsernameDeleteRequest;

  try {
    const data = await api.deleteUserRoleApiV1UserRolesUsernameDelete(body);
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
| **username** | `string` |  | [Defaults to `undefined`] |

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


## listUserRolesApiV1UserRolesGet

> Array&lt;UserRoleResponse&gt; listUserRolesApiV1UserRolesGet()

List User Roles

### Example

```ts
import {
  Configuration,
  UserRolesApi,
} from '';
import type { ListUserRolesApiV1UserRolesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UserRolesApi(config);

  try {
    const data = await api.listUserRolesApiV1UserRolesGet();
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

[**Array&lt;UserRoleResponse&gt;**](UserRoleResponse.md)

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


## upsertUserRoleApiV1UserRolesUsernamePut

> UserRoleResponse upsertUserRoleApiV1UserRolesUsernamePut(username, userRoleUpdate)

Upsert User Role

### Example

```ts
import {
  Configuration,
  UserRolesApi,
} from '';
import type { UpsertUserRoleApiV1UserRolesUsernamePutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UserRolesApi(config);

  const body = {
    // string
    username: username_example,
    // UserRoleUpdate
    userRoleUpdate: ...,
  } satisfies UpsertUserRoleApiV1UserRolesUsernamePutRequest;

  try {
    const data = await api.upsertUserRoleApiV1UserRolesUsernamePut(body);
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
| **username** | `string` |  | [Defaults to `undefined`] |
| **userRoleUpdate** | [UserRoleUpdate](UserRoleUpdate.md) |  | |

### Return type

[**UserRoleResponse**](UserRoleResponse.md)

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

