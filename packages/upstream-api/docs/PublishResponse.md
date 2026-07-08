
# PublishResponse

Response schema for publish/unpublish operations.

## Properties

Name | Type
------------ | -------------
`success` | boolean
`message` | string
`publishedCount` | number
`errors` | Array&lt;string&gt;
`id` | number
`type` | string
`isPublished` | boolean
`publishedAt` | Date
`cascadedItems` | Array&lt;string&gt;
`errorCode` | string
`errorTitle` | string
`errorDetail` | string
`ckanDatasetName` | string
`ckanDatasetUrl` | string

## Example

```typescript
import type { PublishResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "success": null,
  "message": null,
  "publishedCount": null,
  "errors": null,
  "id": null,
  "type": null,
  "isPublished": null,
  "publishedAt": null,
  "cascadedItems": null,
  "errorCode": null,
  "errorTitle": null,
  "errorDetail": null,
  "ckanDatasetName": null,
  "ckanDatasetUrl": null,
} satisfies PublishResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublishResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


