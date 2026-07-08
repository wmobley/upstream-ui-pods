
# PermissionResponse


## Properties

Name | Type
------------ | -------------
`canEdit` | boolean
`canDelete` | boolean
`isOwner` | boolean

## Example

```typescript
import type { PermissionResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "canEdit": null,
  "canDelete": null,
  "isOwner": null,
} satisfies PermissionResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PermissionResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


