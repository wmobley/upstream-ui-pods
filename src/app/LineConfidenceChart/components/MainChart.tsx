import * as React from 'react';
import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';
import { ScaleLinear } from 'd3-scale';
import { AdditionalSensor } from '../LineConfidenceChart';

// Types
interface TooltipData {
  x: number;
  y: number;
  data: AggregatedMeasurement;
}

interface PointTooltipData extends Partial<MeasurementItem> {
  x: number;
  y: number;
}

interface MainChartProps {
  loading: boolean;
  data: AggregatedMeasurement[];
  allPoints?: MeasurementItem[];
  scales: {
    xScale: ScaleLinear<number, number>;
    yScale: ScaleLinear<number, number>;
  };
  chartDimensions: {
    innerWidth: number;
    mainInnerHeight: number;
  };
  paths: {
    mainAreaPaths: (string | null)[];
    mainLinePaths: (string | null)[];
    additionalSensorPaths?: Array<{
      mainAreaPaths: (string | null)[];
      mainLinePaths: (string | null)[];
    }>;
  };
  axisTicks: {
    xTicks: { value: number; label: string; x: number }[];
    yTicks: { value: number; label: string; y: number }[];
  };
  margin: { top: number; right: number; bottom: number; left: number };
  colors: {
    line?: string;
    area?: string;
    point?: string;
  };
  pointRadius: number;
  xAxisTitle: string;
  yAxisTitle: string;
  setTooltipAggregation: React.Dispatch<
    React.SetStateAction<TooltipData | null>
  >;
  setTooltipPoint?: React.Dispatch<
    React.SetStateAction<PointTooltipData | null>
  >;
  additionalSensors?: AdditionalSensor[];
  colorPalette?: Array<{
    line: string;
    area: string;
    point: string;
  }>;
  renderDataPoints: boolean;
}

// Helper Components
interface PathProps {
  path: string | null;
  color: string | undefined;
  keyPrefix: string;
  index: number;
  isArea?: boolean;
}

const ChartPath: React.FC<PathProps> = React.memo(
  ({ path, color, keyPrefix, index, isArea }) => {
    if (!path) return null;

    return isArea ? (
      <path
        key={`${keyPrefix}-${index}`}
        d={path}
        fill={color}
        fillOpacity={0.2}
        stroke="none"
      />
    ) : (
      <path
        key={`${keyPrefix}-${index}`}
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
      />
    );
  },
);

interface DataPointProps {
  cx: number;
  cy: number;
  radius: number;
  color: string | undefined;
  pointKey: string;
  isInteractive?: boolean;
  onClick?: (e: React.MouseEvent<SVGCircleElement>) => void;
}

const DataPoint: React.FC<DataPointProps> = React.memo(
  ({ cx, cy, radius, color, pointKey, isInteractive, onClick }) => (
    <circle
      key={pointKey}
      cx={cx}
      cy={cy}
      r={radius}
      fill={color}
      opacity={1}
      onClick={onClick}
      style={isInteractive ? { cursor: 'pointer' } : undefined}
    />
  ),
);

// Main component
const MainChart: React.FC<MainChartProps> = ({
  data,
  allPoints,
  loading,
  scales,
  chartDimensions,
  paths,
  axisTicks,
  margin,
  colors,
  pointRadius = 3, // Default value
  xAxisTitle,
  yAxisTitle,
  setTooltipAggregation,
  setTooltipPoint,
  additionalSensors,
  colorPalette,
  renderDataPoints = true, // Default value
}) => {
  // Helper function to handle tooltip positioning
  const handleTooltipPosition = React.useCallback(
    (
      e: React.MouseEvent<SVGCircleElement>,
      data: AggregatedMeasurement | MeasurementItem,
    ) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const svgRect = e.currentTarget.closest('svg')?.getBoundingClientRect();
      if (!svgRect) return null;

      return {
        x: rect.left - svgRect.left,
        y: rect.top - svgRect.top,
        data,
      };
    },
    [],
  );

  // Helper function to get color for a sensor at a specified index
  const getSensorColor = React.useCallback(
    (colorType: 'line' | 'area' | 'point', sensorIndex: number = 0) => {
      return colorPalette?.[sensorIndex]?.[colorType] || colors[colorType];
    },
    [colorPalette, colors],
  );

  // Memoized components
  const renderAreaPaths = React.useMemo(
    () => (
      <>
        {/* Primary Sensor Area Paths */}
        {paths?.mainAreaPaths.map((path, i) => (
          <ChartPath
            key={`area-${i}`}
            path={path}
            color={getSensorColor('area', 0)}
            keyPrefix="area"
            index={i}
            isArea
          />
        ))}

        {/* Additional Sensors Area Paths */}
        {paths?.additionalSensorPaths?.map((sensorPaths, sensorIndex) =>
          sensorPaths.mainAreaPaths.map((path, i) => (
            <ChartPath
              key={`area-sensor-${sensorIndex}-${i}`}
              path={path}
              color={getSensorColor('area', sensorIndex + 1)}
              keyPrefix={`area-sensor-${sensorIndex}`}
              index={i}
              isArea
            />
          )),
        )}
      </>
    ),
    [paths?.mainAreaPaths, paths?.additionalSensorPaths, getSensorColor],
  );

  const renderLinePaths = React.useMemo(
    () => (
      <>
        {/* Primary Sensor Line Paths */}
        {paths?.mainLinePaths.map((path, i) => (
          <ChartPath
            key={`line-${i}`}
            path={path}
            color={getSensorColor('line', 0)}
            keyPrefix="line"
            index={i}
            isArea={false}
          />
        ))}

        {/* Additional Sensors Line Paths */}
        {paths?.additionalSensorPaths?.map((sensorPaths, sensorIndex) =>
          sensorPaths.mainLinePaths.map((path, i) => (
            <ChartPath
              key={`line-sensor-${sensorIndex}-${i}`}
              path={path}
              color={getSensorColor('line', sensorIndex + 1)}
              keyPrefix={`line-sensor-${sensorIndex}`}
              index={i}
              isArea={false}
            />
          )),
        )}
      </>
    ),
    [paths?.mainLinePaths, paths?.additionalSensorPaths, getSensorColor],
  );

  const renderDataPointCircles = React.useMemo(
    () => (
      <>
        {/* Primary Sensor Points */}
        {data.map((d) => (
          <DataPoint
            key={`point-${d.measurementTime.getTime()}`}
            cx={scales.xScale(d.measurementTime.getTime())}
            cy={scales.yScale(d.value)}
            radius={pointRadius}
            color={getSensorColor('point', 0)}
            pointKey={`point-${d.measurementTime.getTime()}`}
            isInteractive={true}
            onClick={(e) => {
              const tooltipPos = handleTooltipPosition(e, d);
              if (tooltipPos) {
                setTooltipAggregation({
                  x: tooltipPos.x,
                  y: tooltipPos.y,
                  data: d,
                });
              }
            }}
          />
        ))}

        {/* Additional Sensors Points */}
        {additionalSensors?.map((sensor, sensorIndex) =>
          sensor.aggregatedData?.map((d) => (
            <DataPoint
              key={`point-${sensor.info.id}-${d.measurementTime.getTime()}`}
              cx={scales.xScale(d.measurementTime.getTime())}
              cy={scales.yScale(d.value)}
              radius={pointRadius}
              color={getSensorColor('point', sensorIndex + 1)}
              pointKey={`point-${sensor.info.id}-${d.measurementTime.getTime()}`}
              isInteractive={true}
              onClick={(e) => {
                const tooltipPos = handleTooltipPosition(e, d);
                if (tooltipPos) {
                  setTooltipAggregation({
                    x: tooltipPos.x,
                    y: tooltipPos.y,
                    data: d,
                  });
                }
              }}
            />
          )),
        )}
      </>
    ),
    [data, additionalSensors, scales, pointRadius, getSensorColor],
  );

  const renderIndividualPoints = React.useMemo(() => {
    // First check renderDataPoints flag - if false, don't render points
    if (!renderDataPoints) {
      console.log('Individual points not rendered: renderDataPoints is false');
      return null;
    } else {
      console.log('Individual points rendered: renderDataPoints is true');
    }
    // Then check if we have the data needed to render points
    if (!allPoints || allPoints.length === 0) {
      console.log('Individual points not rendered: no data points available');
      return null;
    }

    // Finally check if we have the tooltip handler
    if (!setTooltipPoint) {
      console.log('Individual points not rendered: missing tooltip handler');
      return null;
    }

    // If all conditions are met, render the points
    return (
      <>
        {allPoints.map((d) => (
          <DataPoint
            key={`individual-${d.collectiontime.getTime()}-${d.value}`}
            cx={scales.xScale(d.collectiontime.getTime())}
            cy={scales.yScale(d.value)}
            radius={pointRadius}
            color={colors.point}
            pointKey={`individual-${d.collectiontime.getTime()}-${d.value}`}
            isInteractive
            onClick={(e) => {
              const tooltipPos = handleTooltipPosition(e, d);
              if (tooltipPos) {
                setTooltipPoint({
                  ...d,
                  x: tooltipPos.x,
                  y: tooltipPos.y,
                });
              }
            }}
          />
        ))}
        {additionalSensors?.map((sensor, sensorIndex) =>
          sensor.allPoints?.map((d, index) => (
            <DataPoint
              key={`individual-${d.collectiontime.getTime()}-${d.value}-${index}`}
              cx={scales.xScale(d.collectiontime.getTime())}
              cy={scales.yScale(d.value)}
              radius={pointRadius}
              color={getSensorColor('point', sensorIndex + 1)}
              pointKey={`individual-${d.collectiontime.getTime()}-${d.value}-${index}`}
              isInteractive
              onClick={(e) => {
                const tooltipPos = handleTooltipPosition(e, d);
                if (tooltipPos) {
                  setTooltipPoint({
                    ...d,
                    x: tooltipPos.x,
                    y: tooltipPos.y,
                  });
                }
              }}
            />
          )),
        )}
      </>
    );
  }, [
    allPoints,
    renderDataPoints,
    setTooltipPoint,
    scales,
    pointRadius,
    colors.point,
    handleTooltipPosition,
  ]);

  const renderXAxis = React.useMemo(
    () => (
      <g
        transform={`translate(0,${chartDimensions.mainInnerHeight})`}
        className="x-axis"
      >
        <rect
          x={-margin.left}
          y={0}
          width={chartDimensions.innerWidth}
          height={margin.bottom}
          fill="white"
        />
        <line
          x1={0}
          x2={chartDimensions.innerWidth}
          y1={0}
          y2={0}
          stroke="var(--gray-400)"
        />
        {axisTicks.xTicks.map((tick) => (
          <g key={tick.value} transform={`translate(${tick.x},0)`}>
            <line y1={0} y2={6} stroke="var(--gray-300)" />
            <text
              y={20}
              textAnchor="middle"
              fill="var(--gray-600)"
              className="text-xs"
            >
              {tick.label}
            </text>
          </g>
        ))}
        <text
          x={chartDimensions.innerWidth}
          y={chartDimensions.mainInnerHeight}
          textAnchor="end"
          fill="var(--gray-600)"
          className="text-xs"
        >
          {xAxisTitle}
        </text>
      </g>
    ),
    [
      chartDimensions.mainInnerHeight,
      chartDimensions.innerWidth,
      margin.left,
      margin.bottom,
      axisTicks.xTicks,
      xAxisTitle,
    ],
  );

  const renderYAxis = React.useMemo(
    () => (
      <g className="y-axis">
        <rect
          x={-margin.left}
          y={-margin.top}
          width={margin.left}
          height={chartDimensions.mainInnerHeight + margin.top + margin.bottom}
          fill="white"
        />
        <line
          x1={0}
          x2={0}
          y1={0}
          y2={chartDimensions.mainInnerHeight}
          stroke="var(--gray-400)"
        />
        {axisTicks.yTicks.map((tick) => (
          <g key={tick.value} transform={`translate(0,${tick.y})`}>
            <line x1={-6} x2={0} stroke="var(--gray-300)" />
            <text
              x={-12}
              y={4}
              textAnchor="end"
              fill="var(--gray-600)"
              className="text-xs"
            >
              {tick.label}
            </text>
          </g>
        ))}
        <text
          transform="rotate(-90)"
          x={-chartDimensions.mainInnerHeight - 100}
          y={-30}
          textAnchor="start"
          fill="var(--gray-600)"
          className="text-xs"
        >
          {yAxisTitle}
        </text>
      </g>
    ),
    [
      margin.left,
      margin.top,
      margin.bottom,
      chartDimensions.mainInnerHeight,
      axisTicks.yTicks,
      yAxisTitle,
    ],
  );

  return (
    <g
      transform={`translate(${margin.left},${margin.top})`}
      className="main-chart"
    >
      {/* Chart background */}
      <rect
        x={0}
        y={0}
        width={chartDimensions.innerWidth}
        height={chartDimensions.mainInnerHeight}
        fill="white"
      />

      {/* Loading indicator */}
      {loading && (
        <g className="loading-layer">
          <rect
            x={0}
            y={0}
            width={chartDimensions.innerWidth}
            height={chartDimensions.mainInnerHeight}
            fill="white"
          />
          <text
            x={chartDimensions.innerWidth / 2}
            y={chartDimensions.mainInnerHeight / 2}
            textAnchor="middle"
            fill="var(--gray-600)"
            className="text-xs"
          >
            Loading...
          </text>
        </g>
      )}

      {/* Data visualization layer */}
      <g className="data-layer">
        {renderAreaPaths}
        {renderLinePaths}
        {renderDataPointCircles}
        {renderIndividualPoints}
        {/* {renderInteractivePoints} */}
      </g>

      {/* Axes layer - rendered last to be on top */}
      <g className="axes-layer">
        {renderXAxis}
        {renderYAxis}
      </g>
    </g>
  );
};

export default React.memo(MainChart);
