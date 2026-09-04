import * as React from 'react';
import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';
import MeasurementNoteCallout, {
  SelectedPointPayload,
} from './components/MeasurementNoteCallout';
import { defaultChartStyles, defaultFormatters } from './utils/chartUtils';
import { useSensorNotes } from '../../hooks/notes/useNotes';
import { useLineConfidence } from 'src/app/Sensor/viz/LineConfidenceViz/context/LineConfidenceContextState';
import { UPlotChart } from './UPlotChart';
import { PointSelectionData } from './plugins/crosshairClick';

// Define the structure of additional sensors
export interface AdditionalSensor {
  info: {
    key: string;
    id: string;
    campaignId: string;
    stationId: string;
  };
  aggregatedData: AggregatedMeasurement[] | null;
  allPoints: MeasurementItem[] | null;
}

// Props
export interface LineConfidenceChartProps {
  data: AggregatedMeasurement[];
  allPoints: MeasurementItem[];
  loading: boolean;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  showAreaOverview?: boolean;
  showLineOverview?: boolean;
  pointRadius?: number;
  colors?: {
    line?: string;
    area?: string;
    point?: string;
  };
  xAxisTitle?: string;
  yAxisTitle?: string;
  xFormatter?: (date: Date | number) => string;
  xFormatterOverview?: (date: Date | number) => string;
  yFormatter?: (value: number) => string;
  onBrush?: (domain: [number, number]) => void;
  gapThresholdMinutes?: number;
  maxValue: number;
  minValue: number;
  additionalSensors?: AdditionalSensor[];
  colorPalette?: Array<{
    line: string;
    area: string;
    point: string;
  }>;
  renderDataPoints: boolean;
  selectedSensorId: string;
  campaignId: string;
  stationId: string;
}

const LineConfidenceChart: React.FC<LineConfidenceChartProps> = ({
  data,
  allPoints,
  loading,
  width,
  height,
  margin = defaultChartStyles.margin,
  showAreaOverview = defaultChartStyles.showAreaOverview,
  showLineOverview = defaultChartStyles.showLineOverview,
  pointRadius = defaultChartStyles.pointRadius,
  colors = defaultChartStyles.colors,
  xAxisTitle = defaultChartStyles.xAxisTitle,
  yAxisTitle = defaultChartStyles.yAxisTitle,
  xFormatter = defaultFormatters.xFormatter,
  xFormatterOverview = defaultFormatters.xFormatter,
  yFormatter = defaultFormatters.yFormatter,
  onBrush,
  gapThresholdMinutes = 120,
  maxValue,
  minValue,
  additionalSensors = [],
  colorPalette = [
    { line: '#9a6fb0', area: '#9a6fb0', point: '#9a6fb0' }, // Primary sensor
    { line: '#4287f5', area: '#4287f5', point: '#4287f5' },
    { line: '#42c5f5', area: '#42c5f5', point: '#42c5f5' },
    { line: '#42f5a7', area: '#42f5a7', point: '#42f5a7' },
    { line: '#f5cd42', area: '#f5cd42', point: '#f5cd42' },
    { line: '#f54242', area: '#f54242', point: '#f54242' },
  ],
  renderDataPoints,
  selectedSensorId: sensorId,
  campaignId,
  stationId,
}) => {
  // View domain state (for external sync)
  const [viewDomain, setViewDomain] = React.useState<[number, number] | null>(null);

  // The measurement currently selected for viewing/adding a note, if any
  const [selectedPoint, setSelectedPoint] = React.useState<SelectedPointPayload | null>(null);

  // Get aggregation settings from context
  const { aggregationInterval, aggregationValue } = useLineConfidence();

  // Fetch notes for this sensor to find timestamps with notes
  const campaignIdNum = parseInt(campaignId, 10);
  const stationIdNum = parseInt(stationId, 10);
  const sensorIdNum = parseInt(sensorId, 10);
  const { data: sensorNotes } = useSensorNotes(
    campaignIdNum,
    stationIdNum,
    sensorIdNum,
  );

  // Extract measurement IDs that have measurement-scoped notes
  const noteMeasurementIds = React.useMemo(() => {
    if (!sensorNotes?.items) return new Set<number>();
    return new Set(
      sensorNotes.items
        .filter((note: { scope: string; measurement_id: number | null }) => note.scope === 'measurement' && note.measurement_id != null)
        .map((note: { measurement_id: number | null }) => note.measurement_id!),
    );
  }, [sensorNotes?.items]);

  // Find timestamps for measurements that have notes by matching with allPoints (which have IDs)
  const noteTimestamps = React.useMemo(() => {
    if (!allPoints || noteMeasurementIds.size === 0) return [];
    const timestamps: number[] = [];
    allPoints.forEach((item) => {
      if (noteMeasurementIds.has(item.id)) {
        timestamps.push(item.collectiontime.getTime());
      }
    });
    return timestamps;
  }, [allPoints, noteMeasurementIds]);

  // Handle point selection from uPlot chart
  const handlePointSelect = React.useCallback(
    (pointData: PointSelectionData) => {
      setSelectedPoint({
        x: pointData.x,
        y: pointData.y,
        measurementId: pointData.measurementId ?? 0,
        timestamp: pointData.timestamp,
        value: pointData.value,
        campaignId: pointData.campaignId,
        stationId: pointData.stationId,
        sensorId: pointData.sensorId,
        bucketContext: pointData.bucketContext,
        geometry: pointData.geometry,
      });
    },
    []
  );

  // Quick validation checks
  if (data.length === 0) {
    return (
      <div className="text-gray-600 text-lg flex justify-center items-center p-4">
        No data available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center relative w-full h-full">
      <UPlotChart
        data={data}
        allPoints={allPoints}
        loading={loading}
        width={width}
        height={height}
        margin={margin}
        showAreaOverview={showAreaOverview}
        showLineOverview={showLineOverview}
        pointRadius={pointRadius}
        colors={colors}
        xAxisTitle={xAxisTitle}
        yAxisTitle={yAxisTitle}
        xFormatter={xFormatter}
        xFormatterOverview={xFormatterOverview}
        yFormatter={yFormatter}
        onBrush={onBrush}
        gapThresholdMinutes={gapThresholdMinutes}
        maxValue={maxValue}
        minValue={minValue}
        additionalSensors={additionalSensors}
        colorPalette={colorPalette}
        renderDataPoints={renderDataPoints}
        selectedSensorId={sensorId}
        campaignId={campaignId}
        stationId={stationId}
        aggregationInterval={aggregationInterval}
        aggregationValue={aggregationValue}
        noteTimestamps={noteTimestamps}
        onYBrush={() => {
          // Could add y-domain callback if needed
        }}
        onPointSelect={handlePointSelect}
        viewDomain={viewDomain}
        onViewDomainChange={setViewDomain}
      />

      {/* Measurement note callout — opens on click, shows/adds notes at that point */}
      {selectedPoint && (
        <MeasurementNoteCallout point={selectedPoint} onClose={() => setSelectedPoint(null)} />
      )}
    </div>
  );
};

export default LineConfidenceChart;