
# MeasurementItem


## Properties

Name | Type
------------ | -------------
`id` | number
`value` | number
`geometry` | [Point](Point.md)
`collectiontime` | Date
`sensorid` | number
`variablename` | string
`variabletype` | string
`description` | string

## Example

```typescript
import type { MeasurementItem } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "value": null,
  "geometry": null,
  "collectiontime": null,
  "sensorid": null,
  "variablename": null,
  "variabletype": null,
  "description": null,
} satisfies MeasurementItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MeasurementItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


