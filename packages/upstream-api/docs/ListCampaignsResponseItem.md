
# ListCampaignsResponseItem


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`location` | [Location](Location.md)
`description` | string
`contactName` | string
`contactEmail` | string
`startDate` | Date
`endDate` | Date
`allocation` | string
`summary` | [SummaryListCampaigns](SummaryListCampaigns.md)
`geometry` | { [key: string]: any; }
`isPublished` | boolean
`publishedAt` | Date
`metadata` | { [key: string]: any; }

## Example

```typescript
import type { ListCampaignsResponseItem } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "location": null,
  "description": null,
  "contactName": null,
  "contactEmail": null,
  "startDate": null,
  "endDate": null,
  "allocation": null,
  "summary": null,
  "geometry": null,
  "isPublished": null,
  "publishedAt": null,
  "metadata": null,
} satisfies ListCampaignsResponseItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListCampaignsResponseItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


