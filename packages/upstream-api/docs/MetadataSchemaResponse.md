
# MetadataSchemaResponse


## Properties

Name | Type
------------ | -------------
`scope` | string
`key` | string
`label` | string
`fieldType` | string
`required` | boolean
`helpText` | string
`units` | string
`ckanField` | string
`ckanMode` | string
`orderIndex` | number
`active` | boolean
`options` | { [key: string]: any; }
`id` | number

## Example

```typescript
import type { MetadataSchemaResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "scope": null,
  "key": null,
  "label": null,
  "fieldType": null,
  "required": null,
  "helpText": null,
  "units": null,
  "ckanField": null,
  "ckanMode": null,
  "orderIndex": null,
  "active": null,
  "options": null,
  "id": null,
} satisfies MetadataSchemaResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MetadataSchemaResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


