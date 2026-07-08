# UploadfileCsvApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**postSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPost**](UploadfileCsvApi.md#postsensorandmeasurementapiv1uploadfilecsvcampaigncampaignidstationstationidsensorpost) | **POST** /api/v1/uploadfile_csv/campaign/{campaign_id}/station/{station_id}/sensor | Post Sensor And Measurement |



## postSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPost

> { [key: string]: any; } postSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPost(campaignId, stationId, uploadFileSensors, uploadFileMeasurements, xTAPISTOKEN, authorization)

Post Sensor And Measurement

Process sensor and measurement files and store data in the database.

### Example

```ts
import {
  Configuration,
  UploadfileCsvApi,
} from '';
import type { PostSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UploadfileCsvApi(config);

  const body = {
    // number
    campaignId: 56,
    // number
    stationId: 56,
    // Blob | File with sensors.
    uploadFileSensors: BINARY_DATA_HERE,
    // Blob | File with measurements.
    uploadFileMeasurements: BINARY_DATA_HERE,
    // string (optional)
    xTAPISTOKEN: xTAPISTOKEN_example,
    // string (optional)
    authorization: authorization_example,
  } satisfies PostSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPostRequest;

  try {
    const data = await api.postSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPost(body);
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
| **uploadFileSensors** | `Blob` | File with sensors. | [Defaults to `undefined`] |
| **uploadFileMeasurements** | `Blob` | File with measurements. | [Defaults to `undefined`] |
| **xTAPISTOKEN** | `string` |  | [Optional] [Defaults to `undefined`] |
| **authorization** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

**{ [key: string]: any; }**

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

