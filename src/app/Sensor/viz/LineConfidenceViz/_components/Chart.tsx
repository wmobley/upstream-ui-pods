import LineConfidenceChart from '../../../../LineConfidenceChart';
import type { AdditionalSensor } from '../../../../LineConfidenceChart/LineConfidenceChart';
import { formatNumber } from '../../../../common/NumberFormatter/NumberFortatterUtils';
import QueryWrapper from '../../../../common/QueryWrapper';
import { useLineConfidence } from '../context/LineConfidenceContextState';
import { formatDateInZone, formatTimeInZone } from '../../../../../utils/timezones';
import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';

export const Chart = () => {
  // Get the time range from context
  const {
    setSelectedTimeRange,
    aggregatedData,
    aggregatedLoading,
    aggregatedError,
    allPoints,
    additionalSensors,
    renderDataPoints,
    addingSensor,
    data,
    campaignId,
    stationId,
    sensorId,
    maxValueChart,
    minValueChart,
    stationTimezone,
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
    if (maxValueChart || minValueChart) {
      return { min: minValueChart ?? 0, max: maxValueChart ?? 0 };
    }

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
          ? item.parametricUpperBound ?? item.maxValue
          : item.parametricUpperBound ?? item.maxValue,
      ),
    );

    return { min: 0, max: max * 1.1 };
  };

  const { min: minValue, max: maxValue } = calculateMinMax();

  const chartAdditionalSensors = adaptSensorsForChart();

  // Colorblind-safe categorical sequence (validated with the dataviz skill's
  // palette checker — CVD/contrast/lightness all pass in this order; do not
  // reorder without re-validating adjacent pairs). Slot 1 is the teal/aqua
  // family closest to the site's brand color, used for the primary sensor.
  const colorPalette = [
    { line: '#1baf7a', area: '#1baf7a', point: '#1baf7a' }, // Primary sensor
    { line: '#eda100', area: '#eda100', point: '#eda100' },
    { line: '#e87ba4', area: '#e87ba4', point: '#e87ba4' },
    { line: '#008300', area: '#008300', point: '#008300' },
    { line: '#4a3aa7', area: '#4a3aa7', point: '#4a3aa7' },
    { line: '#e34948', area: '#e34948', point: '#e34948' },
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
            xAxisTitle={`Date (${stationTimezone})`}
            yAxisTitle={data?.units ?? 'value'}
            xFormatter={(date: Date | number) => {
              return formatTimeInZone(date, stationTimezone);
            }}
            xFormatterOverview={(date: Date | number) => {
              // Short, date-only label for x-axis ticks (see UPlotChart's
              // timeFormatter) — the full date+time is reserved for the
              // crosshair/tooltip via xFormatter above.
              return formatDateInZone(date, stationTimezone);
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
            campaignId={campaignId}
            stationId={stationId}
          />
        </div>
      )}
    </QueryWrapper>
  );
};
