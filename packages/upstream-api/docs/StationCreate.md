
# StationCreate


## Properties

Name | Type
------------ | -------------
`name` | string
`description` | string
`contactName` | string
`contactEmail` | string
`active` | boolean
`startDate` | Date
`stationType` | [StationType](StationType.md)
`metadata` | { [key: string]: any; }

## Example

```typescript
import type { StationCreate } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "description": null,
  "contactName": null,
  "contactEmail": null,
  "active": null,
  "startDate": null,
  "stationType": null,
  "metadata": null,
} satisfies StationCreate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as StationCreate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


