import * as React from 'react';
import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';
import { ScaleLinear } from 'd3-scale';
import { AdditionalSensor } from '../LineConfidenceChart';
import { useChartBrush } from '../hooks/useChartBrush';

// Types
interface TooltipData {
  x: number;
  y: number;
  data: AggregatedMeasurement;
  sensorId: string;
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
  selectedSensorId: string;
  overviewRef: React.RefObject<SVGGElement>;
  setViewDomain: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  onBrush?: (domain: [number, number]) => void;
  showLineOverview?: boolean;
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

// Add ResetButton component
const ResetButton: React.FC<{
  onClick: () => void;
  x: number;
  y: number;
}> = React.memo(({ onClick, x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <rect
      x={0}
      y={0}
      width={80}
      height={24}
      rx={4}
      fill="white"
      stroke="var(--gray-400)"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    />
    <text
      x={40}
      y={16}
      textAnchor="middle"
      fill="var(--gray-600)"
      className="text-xs"
      style={{ pointerEvents: 'none' }}
    >
      Reset View
    </text>
  </g>
));

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
  selectedSensorId,
  overviewRef,
  setViewDomain,
  onBrush,
  showLineOverview,
}) => {
  // Get resetZoom function from useChartBrush
  const { resetZoom } = useChartBrush({
    overviewRef,
    innerWidth: chartDimensions.innerWidth,
    overviewInnerHeight: chartDimensions.mainInnerHeight,
    overviewXScale: scales.xScale,
    setViewDomain,
    onBrush,
  });

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
      <g className="data-points-layer" style={{ pointerEvents: 'all' }}>
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
              e.stopPropagation(); // Prevent event from bubbling to zoom container
              const tooltipPos = handleTooltipPosition(e, d);
              if (tooltipPos) {
                setTooltipAggregation({
                  x: tooltipPos.x,
                  y: tooltipPos.y,
                  data: d,
                  sensorId: selectedSensorId,
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
                e.stopPropagation(); // Prevent event from bubbling to zoom container
                const tooltipPos = handleTooltipPosition(e, d);
                if (tooltipPos) {
                  setTooltipAggregation({
                    x: tooltipPos.x,
                    y: tooltipPos.y,
                    data: d,
                    sensorId: sensor.info.id,
                  });
                }
              }}
            />
          )),
        )}
      </g>
    ),
    [
      data,
      additionalSensors,
      scales,
      pointRadius,
      getSensorColor,
      selectedSensorId,
      setTooltipAggregation,
    ],
  );

  const renderIndividualPoints = React.useMemo(() => {
    if (
      !renderDataPoints ||
      !allPoints ||
      allPoints.length === 0 ||
      !setTooltipPoint
    ) {
      return null;
    }

    return (
      <g className="individual-points-layer" style={{ pointerEvents: 'all' }}>
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
              e.stopPropagation(); // Prevent event from bubbling to zoom container
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
                e.stopPropagation(); // Prevent event from bubbling to zoom container
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
      </g>
    );
  }, [
    allPoints,
    renderDataPoints,
    setTooltipPoint,
    scales,
    pointRadius,
    colors.point,
    handleTooltipPosition,
    additionalSensors,
    getSensorColor,
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

      {/* Zoom container - rendered first to handle wheel events */}
      {showLineOverview && (
        <g
          ref={overviewRef}
          className="zoom-container"
          style={{
            pointerEvents: 'all',
            cursor: 'grab',
          }}
        >
          <rect
            x={0}
            y={0}
            width={chartDimensions.innerWidth}
            height={chartDimensions.mainInnerHeight}
            fill="transparent"
            style={{ pointerEvents: 'all' }}
          />
        </g>
      )}

      {/* Data visualization layer - rendered on top of zoom container */}
      <g
        className="data-layer"
        style={{
          pointerEvents: 'all',
          isolation: 'isolate', // Creates a new stacking context
        }}
      >
        {renderAreaPaths}
        {renderLinePaths}
        {renderDataPointCircles}
        {renderIndividualPoints}
      </g>

      {/* Axes layer - rendered last to be on top */}
      <g
        className="axes-layer"
        style={{
          pointerEvents: 'none', // Axes should not interfere with interactions
        }}
      >
        {renderXAxis}
        {renderYAxis}
      </g>

      {/* Reset button */}
      <ResetButton
        x={chartDimensions.innerWidth - 90}
        y={-30}
        onClick={resetZoom}
      />
    </g>
  );
};

export default React.memo(MainChart);
