import { useMemo } from 'react';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { line, curveCatmullRom, area } from 'd3-shape';
import { AggregatedMeasurement } from '@upstream/upstream-api';
import { getDataSegments } from '../utils/chartUtils';
import { AdditionalSensor } from '../LineConfidenceChart';

interface ChartDimensions {
  innerWidth: number;
  mainInnerHeight: number;
  overviewInnerHeight: number;
}

interface UseChartScalesProps {
  data: AggregatedMeasurement[];
  chartDimensions: ChartDimensions;
  viewDomain: [number, number] | null;
  gapThresholdMinutes: number;
  minValue: number;
  maxValue: number;
  xFormatter?: (date: Date | number) => string;
  yFormatter?: (value: number) => string;
  additionalSensors?: AdditionalSensor[];
}

/**
 * Custom hook to create scales and path generators for the chart
 */
export function useChartScales({
  data,
  chartDimensions,
  viewDomain,
  gapThresholdMinutes,
  minValue,
  maxValue,
  additionalSensors = [],
  xFormatter = (value) => value.toString(),
  yFormatter = (value) => value.toString(),
}: UseChartScalesProps) {
  // Memoize scales for both charts
  const scales = useMemo(() => {
    const xExtent = extent(data, (d) => d.measurementTime.getTime());

    // Consider additional sensors when calculating x extent
    additionalSensors.forEach((sensor) => {
      if (sensor.aggregatedData && sensor.aggregatedData.length > 0) {
        const sensorXExtent = extent(sensor.aggregatedData, (d) =>
          d.measurementTime.getTime(),
        );
        if (sensorXExtent[0] && sensorXExtent[1]) {
          if (!xExtent[0] || sensorXExtent[0] < xExtent[0]) {
            xExtent[0] = sensorXExtent[0];
          }
          if (!xExtent[1] || sensorXExtent[1] > xExtent[1]) {
            xExtent[1] = sensorXExtent[1];
          }
        }
      }
    });

    const yExtent = [minValue, maxValue];

    if (!xExtent[0] || !xExtent[1] || !yExtent[0] || !yExtent[1]) {
      return null;
    }

    // Add padding to the x-axis range to ensure points at the edges are fully visible
    const xPadding = chartDimensions.innerWidth * 0.01; // 1% padding on each side

    // Main chart scales - use viewDomain if available
    const xScale = scaleLinear()
      .domain(viewDomain || [xExtent[0], xExtent[1]])
      .range([xPadding, chartDimensions.innerWidth - xPadding]);

    const yScale = scaleLinear()
      .domain(yExtent)
      .range([chartDimensions.mainInnerHeight, 0]);

    // Overview chart scales
    const overviewXScale = scaleLinear()
      .domain([xExtent[0], xExtent[1]])
      .range([xPadding, chartDimensions.innerWidth - xPadding]);

    const overviewYScale = scaleLinear()
      .domain(yExtent)
      .range([chartDimensions.overviewInnerHeight, 0]);

    return { xScale, yScale, overviewXScale, overviewYScale };
  }, [
    data,
    chartDimensions,
    viewDomain,
    minValue,
    maxValue,
    additionalSensors,
  ]);

  // Memoize path generators for both charts
  const paths = useMemo(() => {
    if (!scales) return null;

    // Get data segments for primary sensor
    const segments = getDataSegments(data, gapThresholdMinutes);

    // Main chart paths
    const mainLineGenerator = line<AggregatedMeasurement>()
      .x((d) => scales.xScale(d.measurementTime.getTime()))
      .y((d) => scales.yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    const mainAreaGenerator = area<AggregatedMeasurement>()
      .x((d) => scales.xScale(d.measurementTime.getTime()))
      .y0((d) => scales.yScale(d.parametricLowerBound))
      .y1((d) => scales.yScale(d.parametricUpperBound))
      .curve(curveCatmullRom.alpha(0.5));

    // Overview chart paths
    const overviewLineGenerator = line<AggregatedMeasurement>()
      .x((d) => scales.overviewXScale(d.measurementTime.getTime()))
      .y((d) => scales.overviewYScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    const overviewAreaGenerator = area<AggregatedMeasurement>()
      .x((d) => scales.overviewXScale(d.measurementTime.getTime()))
      .y0((d) => scales.overviewYScale(d.parametricLowerBound))
      .y1((d) => scales.overviewYScale(d.parametricUpperBound))
      .curve(curveCatmullRom.alpha(0.5));

    // Generate paths for each segment of primary sensor
    const mainLinePaths = segments.map((segment) => mainLineGenerator(segment));
    const mainAreaPaths = segments.map((segment) => mainAreaGenerator(segment));
    const overviewLinePaths = segments.map((segment) =>
      overviewLineGenerator(segment),
    );
    const overviewAreaPaths = segments.map((segment) =>
      overviewAreaGenerator(segment),
    );

    // Generate paths for additional sensors
    const additionalSensorPaths = additionalSensors.map((sensor) => {
      if (!sensor.aggregatedData || sensor.aggregatedData.length === 0) {
        return {
          mainLinePaths: [],
          mainAreaPaths: [],
          overviewLinePaths: [],
          overviewAreaPaths: [],
        };
      }

      const sensorSegments = getDataSegments(
        sensor.aggregatedData,
        gapThresholdMinutes,
      );

      return {
        mainLinePaths: sensorSegments.map((segment) =>
          mainLineGenerator(segment),
        ),
        mainAreaPaths: sensorSegments.map((segment) =>
          mainAreaGenerator(segment),
        ),
        overviewLinePaths: sensorSegments.map((segment) =>
          overviewLineGenerator(segment),
        ),
        overviewAreaPaths: sensorSegments.map((segment) =>
          overviewAreaGenerator(segment),
        ),
      };
    });

    return {
      mainLinePaths,
      mainAreaPaths,
      overviewLinePaths,
      overviewAreaPaths,
      additionalSensorPaths,
    };
  }, [data, additionalSensors, scales, gapThresholdMinutes]);

  // Memoize axis ticks for main chart
  const axisTicks = useMemo(() => {
    if (!scales) return null;

    const xTicks = scales.xScale.ticks(5).map((tick) => ({
      value: tick,
      label: xFormatter(tick),
      x: scales.xScale(tick),
    }));

    const yTicks = scales.yScale.ticks(5).map((tick) => ({
      value: tick,
      label: yFormatter(tick),
      y: scales.yScale(tick),
    }));

    return { xTicks, yTicks };
  }, [scales, xFormatter, yFormatter]);

  return { scales, paths, axisTicks };
}
