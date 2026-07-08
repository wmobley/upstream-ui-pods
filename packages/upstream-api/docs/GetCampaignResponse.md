
# GetCampaignResponse


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`description` | string
`contactName` | string
`contactEmail` | string
`startDate` | Date
`endDate` | Date
`allocation` | string
`location` | [Location](Location.md)
`summary` | [SummaryGetCampaign](SummaryGetCampaign.md)
`geometry` | { [key: string]: any; }
`stations` | [Array&lt;StationsListResponseItem&gt;](StationsListResponseItem.md)
`isPublished` | boolean
`publishedAt` | Date
`metadata` | { [key: string]: any; }

## Example

```typescript
import type { GetCampaignResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "description": null,
  "contactName": null,
  "contactEmail": null,
  "startDate": null,
  "endDate": null,
  "allocation": null,
  "location": null,
  "summary": null,
  "geometry": null,
  "stations": null,
  "isPublished": null,
  "publishedAt": null,
  "metadata": null,
} satisfies GetCampaignResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetCampaignResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


