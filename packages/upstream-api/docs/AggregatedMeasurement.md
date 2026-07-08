
# AggregatedMeasurement


## Properties

Name | Type
------------ | -------------
`measurementTime` | Date
`value` | number
`medianValue` | number
`pointCount` | number
`lowerBound` | number
`upperBound` | number
`parametricLowerBound` | number
`parametricUpperBound` | number
`stdDev` | number
`minValue` | number
`maxValue` | number
`percentile25` | number
`percentile75` | number
`ciMethod` | string
`confidenceLevel` | number

## Example

```typescript
import type { AggregatedMeasurement } from ''

// TODO: Update the object below with actual values
const example = {
  "measurementTime": null,
  "value": null,
  "medianValue": null,
  "pointCount": null,
  "lowerBound": null,
  "upperBound": null,
  "parametricLowerBound": null,
  "parametricUpperBound": null,
  "stdDev": null,
  "minValue": null,
  "maxValue": null,
  "percentile25": null,
  "percentile75": null,
  "ciMethod": null,
  "confidenceLevel": null,
} satisfies AggregatedMeasurement

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AggregatedMeasurement
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


