
# GetSensorResponse


## Properties

Name | Type
------------ | -------------
`id` | number
`alias` | string
`description` | string
`postprocess` | boolean
`postprocessscript` | string
`units` | string
`variablename` | string
`isPublished` | boolean
`publishedAt` | Date
`statistics` | [SensorStatistics](SensorStatistics.md)
`metadata` | { [key: string]: any; }

## Example

```typescript
import type { GetSensorResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "alias": null,
  "description": null,
  "postprocess": null,
  "postprocessscript": null,
  "units": null,
  "variablename": null,
  "isPublished": null,
  "publishedAt": null,
  "statistics": null,
  "metadata": null,
} satisfies GetSensorResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetSensorResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


