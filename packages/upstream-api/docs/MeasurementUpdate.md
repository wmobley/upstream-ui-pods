
# MeasurementUpdate


## Properties

Name | Type
------------ | -------------
`sensorid` | number
`collectiontime` | Date
`geometry` | string
`measurementvalue` | number
`variablename` | string
`variabletype` | string
`description` | string

## Example

```typescript
import type { MeasurementUpdate } from ''

// TODO: Update the object below with actual values
const example = {
  "sensorid": null,
  "collectiontime": null,
  "geometry": null,
  "measurementvalue": null,
  "variablename": null,
  "variabletype": null,
  "description": null,
} satisfies MeasurementUpdate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MeasurementUpdate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


