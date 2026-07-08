
# CampaignsIn


## Properties

Name | Type
------------ | -------------
`name` | string
`contactName` | string
`contactEmail` | string
`description` | string
`startDate` | Date
`endDate` | Date
`allocation` | string
`metadata` | { [key: string]: any; }

## Example

```typescript
import type { CampaignsIn } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "contactName": null,
  "contactEmail": null,
  "description": null,
  "startDate": null,
  "endDate": null,
  "allocation": null,
  "metadata": null,
} satisfies CampaignsIn

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CampaignsIn
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


