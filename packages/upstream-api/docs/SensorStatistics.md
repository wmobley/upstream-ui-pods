
# SensorStatistics


## Properties

Name | Type
------------ | -------------
`maxValue` | number
`minValue` | number
`avgValue` | number
`stddevValue` | number
`percentile90` | number
`percentile95` | number
`percentile99` | number
`count` | number
`firstMeasurementValue` | number
`firstMeasurementCollectiontime` | Date
`lastMeasurementTime` | Date
`lastMeasurementValue` | number
`statsLastUpdated` | Date

## Example

```typescript
import type { SensorStatistics } from ''

// TODO: Update the object below with actual values
const example = {
  "maxValue": null,
  "minValue": null,
  "avgValue": null,
  "stddevValue": null,
  "percentile90": null,
  "percentile95": null,
  "percentile99": null,
  "count": null,
  "firstMeasurementValue": null,
  "firstMeasurementCollectiontime": null,
  "lastMeasurementTime": null,
  "lastMeasurementValue": null,
  "statsLastUpdated": null,
} satisfies SensorStatistics

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SensorStatistics
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


