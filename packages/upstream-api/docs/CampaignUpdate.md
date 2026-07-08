
# CampaignUpdate


## Properties

Name | Type
------------ | -------------
`name` | string
`description` | string
`contactName` | string
`contactEmail` | string
`allocation` | string
`startDate` | Date
`endDate` | Date
`metadata` | { [key: string]: any; }

## Example

```typescript
import type { CampaignUpdate } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "description": null,
  "contactName": null,
  "contactEmail": null,
  "allocation": null,
  "startDate": null,
  "endDate": null,
  "metadata": null,
} satisfies CampaignUpdate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CampaignUpdate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


