
# ListMeasurementsResponsePagination


## Properties

Name | Type
------------ | -------------
`items` | [Array&lt;MeasurementItem&gt;](MeasurementItem.md)
`total` | number
`page` | number
`size` | number
`pages` | number
`minValue` | number
`maxValue` | number
`averageValue` | number
`downsampled` | boolean
`downsampledTotal` | number

## Example

```typescript
import type { ListMeasurementsResponsePagination } from ''

// TODO: Update the object below with actual values
const example = {
  "items": null,
  "total": null,
  "page": null,
  "size": null,
  "pages": null,
  "minValue": null,
  "maxValue": null,
  "averageValue": null,
  "downsampled": null,
  "downsampledTotal": null,
} satisfies ListMeasurementsResponsePagination

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListMeasurementsResponsePagination
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


