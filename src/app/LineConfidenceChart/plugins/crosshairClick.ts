import * as uPlot from 'uplot';
import { MeasurementItem } from '@upstream/upstream-api';

/**
 * Data needed for point selection callbacks
 */
export interface PointSelectionData {
  measurementId: number | null;
  timestamp: Date;
  value: number;
  campaignId: string;
  stationId: string;
  sensorId: string;
  bucketContext: { averageValue: number; pointCount: number } | null;
  geometry: GeoJSON.Point | null;
  x: number;
  y: number;
}

export interface CrosshairClickOptions {
  /** Raw measurement items for lookup */
  allPoints: MeasurementItem[];
  /** Additional sensors' raw points */
  additionalPoints: Array<MeasurementItem[] | null>;
  /** Primary sensor ID */
  sensorId: string;
  /** Campaign ID */
  campaignId: string;
  /** Station ID */
  stationId: string;
  /** Called when a point is clicked */
  onPointSelect?: (data: PointSelectionData) => void;
  /** Called when cursor moves over a point (for tooltips) */
  onPointHover?: (data: PointSelectionData | null) => void;
}

/**
 * uPlot plugin for crosshair cursor and point click selection
 * Maps uPlot series index to original measurement IDs
 */
export function crosshairClickPlugin(opts: CrosshairClickOptions): uPlot.Plugin {
  const {
    allPoints,
    additionalPoints,
    sensorId,
    campaignId,
    stationId,
    onPointHover,
  } = opts;

  let lastHoverIdx = -1;

  // Build combined points array for nearest-neighbor lookup
  const combinedPoints: Array<{ time: number; value: number; id: number; geometry: GeoJSON.Point }> = [];
  allPoints.forEach((p) => {
    combinedPoints.push({
      time: p.collectiontime.getTime(),
      value: p.value ?? 0,
      id: p.id,
      geometry: p.geometry as unknown as GeoJSON.Point,
    });
  });
  additionalPoints.forEach((points) => {
    points?.forEach((p) => {
      combinedPoints.push({
        time: p.collectiontime.getTime(),
        value: p.value ?? 0,
        id: p.id,
        geometry: p.geometry as unknown as GeoJSON.Point,
      });
    });
  });

  // Sort by time for binary search
  combinedPoints.sort((a, b) => a.time - b.time);

  function findNearestMeasurement(targetTime: number): { id: number; time: number; value: number; geometry: GeoJSON.Point } | null {
    if (combinedPoints.length === 0) return null;

    // Binary search for nearest timestamp
    let low = 0;
    let high = combinedPoints.length - 1;
    let nearest = combinedPoints[0];
    let nearestDelta = Math.abs(combinedPoints[0].time - targetTime);

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const delta = Math.abs(combinedPoints[mid].time - targetTime);
      if (delta < nearestDelta) {
        nearestDelta = delta;
        nearest = combinedPoints[mid];
      }
      if (combinedPoints[mid].time < targetTime) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return nearest;
  }

  // Helper to get stroke color from series (returns string or calls function)
  function getStrokeStyle(s: uPlot.Series, u: uPlot): CanvasRenderingContext2D['strokeStyle'] {
    const stroke = s.stroke;
    if (typeof stroke === 'string') return stroke;
    if (typeof stroke === 'function') return stroke(u, 0);
    return '#9a6fb0';
  }

  // Helper to safely get valToPos
  function safeValToPos(u: uPlot, val: number, scaleKey: string | undefined): number {
    const result = u.valToPos(val, scaleKey ?? 'y', true);
    return result ?? 0;
  }

  return {
    hooks: {
      draw: (u: uPlot) => {
        if (!u.ctx || u.cursor.left == null || u.cursor.top == null) return;

        const ctx = u.ctx;
        const { left, top, width, height } = u.bbox;
        const cursorX = u.cursor.left;
        const cursorY = u.cursor.top;

        // Only draw if cursor is in plot area
        if (cursorX < left || cursorX > left + width || cursorY < top || cursorY > top + height) {
          return;
        }

        // Find nearest data index
        const xVal = u.posToVal(cursorX, 'x');
        const idx = u.valToIdx(xVal);
        if (idx < 0 || idx >= (u.data[0]?.length ?? 0)) return;

        // Get timestamp at this index
        const ts = u.data[0]?.[idx];
        if (ts == null) return;

        // Draw vertical crosshair line
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cursorX, top);
        ctx.lineTo(cursorX, top + height);
        ctx.stroke();
        ctx.restore();

        // Draw point highlights for all visible series at this index
        u.series.forEach((s, si) => {
          if (si === 0 || !s.show) return; // Skip x-axis and hidden series
          const label = typeof s.label === 'string' ? s.label : '';
          if (label.includes('Upper') || label.includes('Lower')) return; // Skip bound series

          const yVal = u.data[si]?.[idx];
          if (yVal == null) return;

          const yPos = safeValToPos(u, yVal, s.scale);
          if (yPos < top || yPos > top + height) return;

          // Draw point highlight
          ctx.save();
          ctx.fillStyle = getStrokeStyle(s, u);
          ctx.beginPath();
          ctx.arc(cursorX, yPos, (s.points?.size as number || 4) + 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Hover callback
        if (idx !== lastHoverIdx && onPointHover) {
          lastHoverIdx = idx;
          const nearest = findNearestMeasurement(ts);
          if (nearest) {
            const yPos = safeValToPos(u, u.data[1]?.[idx] ?? 0, u.series[1]?.scale ?? 'y');
            onPointHover({
              measurementId: nearest.id,
              timestamp: new Date(nearest.time),
              value: nearest.value,
              campaignId,
              stationId,
              sensorId,
              bucketContext: null,
              geometry: nearest.geometry,
              x: cursorX,
              y: yPos,
            });
          } else {
            onPointHover(null);
          }
        }
      },
    },
  };
}

/**
 * Plugin for drawing confidence bands between upper/lower series
 */
export function confidenceBandPlugin(): uPlot.Plugin {
  // Helper to safely get valToPos
  function safeValToPos(u: uPlot, val: number, scaleKey: string | undefined): number {
    const result = u.valToPos(val, scaleKey ?? 'y', true);
    return result ?? 0;
  }

  // Helper to get stroke color from series
  function getStrokeStyle(s: uPlot.Series, u: uPlot): CanvasRenderingContext2D['strokeStyle'] {
    const stroke = s.stroke;
    if (typeof stroke === 'string') return stroke;
    if (typeof stroke === 'function') return stroke(u, 0);
    return '#9a6fb0';
  }

  return {
    hooks: {
      draw: (u: uPlot) => {
        if (!u.ctx) return;

        const ctx = u.ctx;

        // Draw bands for each sensor
        // Primary: series 1 (value), 2 (upper), 3 (lower)
        // Additional: series 4,5,6 then 7,8,9 etc.
        for (let si = 1; si < u.series.length; si += 3) {
          const valueSeries = u.series[si];
          const upperSeries = u.series[si + 1];
          const lowerSeries = u.series[si + 2];

          if (!valueSeries || !upperSeries || !lowerSeries) continue;
          if (!valueSeries.show) continue;

          const strokeStyle = getStrokeStyle(valueSeries, u);
          // Convert to string for fillStyle (which accepts string | CanvasGradient | CanvasPattern)
          const fillStyle: string = typeof strokeStyle === 'string' ? `${strokeStyle}33` : '#9a6fb033';

          // Build path for confidence band
          ctx.save();
          ctx.beginPath();

          let pathStarted = false;
          const dataLen = u.data[0]?.length ?? 0;

          for (let i = 0; i < dataLen; i++) {
            const xVal = u.data[0]?.[i];
            const upperVal = u.data[si + 1]?.[i];
            const lowerVal = u.data[si + 2]?.[i];

            if (xVal == null || upperVal == null || lowerVal == null) {
              if (pathStarted) {
                // Close path and fill
                ctx.fillStyle = fillStyle;
                ctx.fill();
                pathStarted = false;
              }
              continue;
            }

            const x = safeValToPos(u, xVal, 'x');
            const yUpper = safeValToPos(u, upperVal, valueSeries.scale);

            if (!pathStarted) {
              ctx.moveTo(x, yUpper);
              pathStarted = true;
            } else {
              ctx.lineTo(x, yUpper);
            }
          }

          // Complete the path (go back along lower bounds)
          if (pathStarted) {
            for (let i = dataLen - 1; i >= 0; i--) {
              const xVal = u.data[0]?.[i];
              const lowerVal = u.data[si + 2]?.[i];
              if (xVal != null && lowerVal != null) {
                const x = safeValToPos(u, xVal, 'x');
                const yLower = safeValToPos(u, lowerVal, valueSeries.scale);
                ctx.lineTo(x, yLower);
              }
            }
            ctx.closePath();
            ctx.fillStyle = fillStyle;
            ctx.fill();
          }

          ctx.restore();
        }
      },
    },
  };
}