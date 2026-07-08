
# StationsListResponseItem


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`description` | string
`contactName` | string
`contactEmail` | string
`active` | boolean
`startDate` | Date
`stationType` | [StationType](StationType.md)
`geometry` | { [key: string]: any; }
`isPublished` | boolean
`publishedAt` | Date
`metadata` | { [key: string]: any; }
`sensors` | [Array&lt;SensorSummaryForStations&gt;](SensorSummaryForStations.md)

## Example

```typescript
import type { StationsListResponseItem } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "description": null,
  "contactName": null,
  "contactEmail": null,
  "active": null,
  "startDate": null,
  "stationType": null,
  "geometry": null,
  "isPublished": null,
  "publishedAt": null,
  "metadata": null,
  "sensors": null,
} satisfies StationsListResponseItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as StationsListResponseItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


