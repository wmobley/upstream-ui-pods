import LineConfidenceChart from '../../../../LineConfidenceChart';
import type { AdditionalSensor } from '../../../../LineConfidenceChart/LineConfidenceChart';
import { formatNumber } from '../../../../common/NumberFormatter/NumberFortatterUtils';
import QueryWrapper from '../../../../common/QueryWrapper';
import { useLineConfidence } from '../context/LineConfidenceContext';
import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';

export const Chart = () => {
  // Get the time range from context
  const {
    selectedTimeRange,
    setSelectedTimeRange,
    aggregatedData,
    aggregatedLoading,
    aggregatedError,
    allPoints,
    additionalSensors,
    renderDataPoints,
    addingSensor,
    data,
    sensorId,
  } = useLineConfidence();

  // Convert the SensorData structure from context to AdditionalSensor for LineConfidenceChart
  const adaptSensorsForChart = (): AdditionalSensor[] => {
    return additionalSensors.map((sensor) => {
      const adaptedSensor: AdditionalSensor = {
        info: sensor.info,
        aggregatedData: sensor.aggregatedData,
        allPoints: (sensor.allPoints?.items as MeasurementItem[]) || null,
      };
      return adaptedSensor;
    });
  };

  // Calculate overall min and max values considering all sensors
  const calculateMinMax = () => {
    if (!aggregatedData) return { min: 0, max: 0 };

    let allData: AggregatedMeasurement[] = [...aggregatedData];

    // Add data from additional sensors
    additionalSensors.forEach((sensor) => {
      if (sensor.aggregatedData) {
        allData = [...allData, ...sensor.aggregatedData];
      }
    });

    const optionOnlyParameterBounds = false;

    if (optionOnlyParameterBounds) {
      allData = allData.filter(
        (item) => item.parametricUpperBound && item.parametricLowerBound,
      );
    }

    const max = Math.max(
      ...allData.map((item) =>
        optionOnlyParameterBounds
          ? item.parametricUpperBound
          : Math.max(item.parametricUpperBound, item.maxValue),
      ),
    );
    const min = Math.min(
      ...allData.map((item) =>
        optionOnlyParameterBounds
          ? item.parametricLowerBound
          : Math.min(item.parametricLowerBound, item.minValue),
      ),
    );

    return { min, max };
  };

  const { min: minValue, max: maxValue } = calculateMinMax();
  const chartAdditionalSensors = adaptSensorsForChart();

  // Define a color palette for the sensors
  const colorPalette = [
    { line: '#9a6fb0', area: '#9a6fb0', point: '#9a6fb0' }, // Primary sensor
    { line: '#4287f5', area: '#4287f5', point: '#4287f5' },
    { line: '#42c5f5', area: '#42c5f5', point: '#42c5f5' },
    { line: '#42f5a7', area: '#42f5a7', point: '#42f5a7' },
    { line: '#f5cd42', area: '#f5cd42', point: '#f5cd42' },
    { line: '#f54242', area: '#f54242', point: '#f54242' },
  ];

  return (
    <QueryWrapper isLoading={aggregatedLoading} error={aggregatedError}>
      {aggregatedData && (
        <div>
          {/* {additionalSensors.length > 0 && (
            <div className="text-sm text-gray-600 mb-2">
              Visualizing {1 + additionalSensors.length} sensors
            </div>
          )} */}
          <LineConfidenceChart
            data={aggregatedData}
            allPoints={allPoints?.items ?? []}
            loading={addingSensor}
            margin={{ top: 10, right: 50, bottom: 50, left: 50 }}
            colors={colorPalette[0]}
            xAxisTitle="Date"
            yAxisTitle={data?.units ?? 'value'}
            xFormatter={(date: Date | number) => {
              const dateObj = date instanceof Date ? date : new Date(date);
              // For main chart - show time
              if (selectedTimeRange) {
                return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
              }
              // For overview - show date
              return dateObj.toLocaleDateString();
            }}
            xFormatterOverview={(date: Date | number) => {
              const dateObj = date instanceof Date ? date : new Date(date);
              return dateObj.toLocaleDateString();
            }}
            yFormatter={(value: number) => {
              return formatNumber(value);
            }}
            onBrush={(domain) => {
              setSelectedTimeRange(domain);
            }}
            maxValue={maxValue}
            minValue={minValue}
            additionalSensors={chartAdditionalSensors}
            colorPalette={colorPalette}
            renderDataPoints={renderDataPoints}
            selectedSensorId={sensorId}
          />
        </div>
      )}
    </QueryWrapper>
  );
};
