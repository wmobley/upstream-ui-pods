
# SensorUpdate


## Properties

Name | Type
------------ | -------------
`alias` | string
`description` | string
`postprocess` | boolean
`postprocessscript` | string
`units` | string
`variablename` | string
`metadata` | { [key: string]: any; }

## Example

```typescript
import type { SensorUpdate } from ''

// TODO: Update the object below with actual values
const example = {
  "alias": null,
  "description": null,
  "postprocess": null,
  "postprocessscript": null,
  "units": null,
  "variablename": null,
  "metadata": null,
} satisfies SensorUpdate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SensorUpdate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


