
# PublishRequest

Request schema for publishing campaigns, stations, or sensors.

## Properties

Name | Type
------------ | -------------
`cascade` | boolean
`force` | boolean
`organization` | string

## Example

```typescript
import type { PublishRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "cascade": null,
  "force": null,
  "organization": null,
} satisfies PublishRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublishRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


