import * as React from 'react';
import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';
import MeasurementNoteCallout, {
  SelectedPointPayload,
} from './components/MeasurementNoteCallout';
import MeasurementNotesPanel from './components/MeasurementNotesPanel';
import { defaultChartStyles, defaultFormatters } from './utils/chartUtils';
import {
  useCreateMeasurementNote,
  useMeasurementNotesBySensor,
} from '../../hooks/notes/useNotes';
import { useAuth } from '../../contexts/AuthContextState';
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
    units?: string;
    label?: string;
    stationName?: string;
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
  sensorLabel?: string;
  stationName?: string;
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
    { line: '#1baf7a', area: '#1baf7a', point: '#1baf7a' }, // Primary sensor
    { line: '#eda100', area: '#eda100', point: '#eda100' },
    { line: '#e87ba4', area: '#e87ba4', point: '#e87ba4' },
    { line: '#008300', area: '#008300', point: '#008300' },
    { line: '#4a3aa7', area: '#4a3aa7', point: '#4a3aa7' },
    { line: '#e34948', area: '#e34948', point: '#e34948' },
  ],
  renderDataPoints,
  selectedSensorId: sensorId,
  campaignId,
  stationId,
  sensorLabel,
  stationName,
}) => {
  // View domain state (for external sync)
  const [viewDomain, setViewDomain] = React.useState<[number, number] | null>(null);

  // The measurement currently selected for viewing/adding a note, if any
  const [selectedPoint, setSelectedPoint] = React.useState<SelectedPointPayload | null>(null);
  const [notesOpen, setNotesOpen] = React.useState(true);

  // Get aggregation settings from context
  const { aggregationInterval, aggregationValue, stationTimezone } = useLineConfidence();
  const { username } = useAuth();

  // Fetch measurement-scoped notes for this sensor for both the panel and
  // the chart's note markers.
  const campaignIdNum = parseInt(campaignId, 10);
  const stationIdNum = parseInt(stationId, 10);
  const sensorIdNum = parseInt(sensorId, 10);
  const {
    data: measurementNotesResponse,
    isLoading: notesLoading,
    isError: notesError,
  } = useMeasurementNotesBySensor(
    campaignIdNum,
    stationIdNum,
    sensorIdNum,
  );

  const measurementNotes = React.useMemo(
    () => measurementNotesResponse?.items ?? [],
    [measurementNotesResponse],
  );

  // The API returns the measurement timestamp alongside each note, so markers remain
  // available even when the chart's current point window does not include the note.
  const noteTimestamps = React.useMemo(
    () => measurementNotes.map((note) => new Date(note.measurement_timestamp).getTime()),
    [measurementNotes],
  );

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

  const selectedCampaignId = parseInt(selectedPoint?.campaignId ?? campaignId, 10);
  const selectedStationId = parseInt(selectedPoint?.stationId ?? stationId, 10);
  const selectedSensorId = parseInt(selectedPoint?.sensorId ?? sensorId, 10);
  const createMeasurementNote = useCreateMeasurementNote(
    selectedCampaignId,
    selectedStationId,
    selectedSensorId,
    selectedPoint?.measurementId ?? 0,
  );

  const handlePanelAdd = React.useCallback(
    (content: string, location?: GeoJSON.Point | null) => {
      if (!selectedPoint?.measurementId) return;
      createMeasurementNote.mutate({ content, location });
    },
    [createMeasurementNote, selectedPoint?.measurementId],
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
    <div className="relative flex h-full w-full flex-col items-stretch justify-center">
      {!notesOpen && (
        <div className="mb-3 flex w-full justify-end">
          <button
            type="button"
            onClick={() => setNotesOpen(true)}
            className="rounded border border-blue-300 bg-white px-3 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-expanded={false}
          >
            Show chart point notes{measurementNotes.length > 0 ? ` (${measurementNotes.length})` : ''}
          </button>
        </div>
      )}

      <div className="flex w-full min-w-0 flex-col items-stretch gap-4 xl:flex-row">
        <div className="min-w-0 flex-1">
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
            sensorLabel={sensorLabel}
            stationName={stationName}
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
        </div>

        {notesOpen && (
          <MeasurementNotesPanel
            notes={measurementNotes}
            isLoading={notesLoading}
            isError={notesError}
            stationTimezone={stationTimezone}
            selectedPoint={selectedPoint}
            canWrite={Boolean(username)}
            isAdding={createMeasurementNote.isPending}
            onAdd={handlePanelAdd}
            onClose={() => setNotesOpen(false)}
          />
        )}
      </div>

      {/* Keep the existing point callout available when the side panel is hidden. */}
      {!notesOpen && selectedPoint && (
        <MeasurementNoteCallout point={selectedPoint} onClose={() => setSelectedPoint(null)} />
      )}
    </div>
  );
};

export default LineConfidenceChart;
