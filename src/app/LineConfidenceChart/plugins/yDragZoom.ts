import * as uPlot from 'uplot';

/**
 * uPlot plugin for Y-axis drag zoom (vertical brush)
 * Allows users to drag on the y-axis to zoom vertically
 */
export interface YDragZoomOptions {
  /** Called when y-zoom domain changes */
  onYZoom?: (domain: [number, number]) => void;
  /** Minimum zoom range (prevent over-zoom) */
  minRange?: number;
}

export function yDragZoomPlugin(opts: YDragZoomOptions = {}): uPlot.Plugin {
  const { onYZoom, minRange = 0.01 } = opts;

  let dragging = false;
  let dragStartY = 0;
  let dragStartDomain: [number, number] | null = null;
  let dragHandleY = 0;

  return {
    hooks: {
      draw: (u: uPlot) => {
        if (!u.ctx) return;

        const ctx = u.ctx;
        const { left, width } = u.bbox;

        // Draw drag selection on y-axis
        if (dragStartDomain) {
          const yScaleKey = u.series[1]?.scale ?? 'y';
          const yScale = u.scales[yScaleKey];
          if (!yScale) return;

          const [yMin, yMax] = dragStartDomain;
          const y1 = u.valToPos(yMax, yScaleKey, true);
          const y2 = u.valToPos(yMin, yScaleKey, true);
          const handleHeight = Math.abs(y2 - y1);

          ctx.save();
          ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1;
          ctx.fillRect(left, Math.min(y1, y2), width, handleHeight);
          ctx.strokeRect(left, Math.min(y1, y2), width, handleHeight);
          ctx.restore();
        }

        // Draw drag line
        if (dragging) {
          ctx.save();
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(left, dragStartY);
          ctx.lineTo(left + width, dragHandleY);
          ctx.stroke();
          ctx.restore();
        }
      },

      ready: (u: uPlot) => {
        // Add mouse event listeners to the canvas for y-axis drag
        const canvas = u.root.querySelector('canvas');
        if (!canvas) return;

        const handleMouseDown = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const { left, top, width, height } = u.bbox;

          // Check if click is on y-axis area (left 50px)
          const axisWidth = 50;
          const isOnYAxis = mouseX >= left - axisWidth && mouseX <= left + width;

          if (isOnYAxis && mouseY >= top && mouseY <= top + height) {
            dragging = true;
            dragStartY = mouseY;
            dragHandleY = mouseY;

            // Get current y domain
            const yScaleKey = u.series[1]?.scale ?? 'y';
            const yScale = u.scales[yScaleKey];
            if (yScale && yScale.min != null && yScale.max != null) {
              dragStartDomain = [yScale.min, yScale.max];
            }

            e.preventDefault();
          }
        };

        const handleMouseMove = (e: MouseEvent) => {
          if (!dragging || !dragStartDomain) return;

          const rect = canvas.getBoundingClientRect();
          const mouseY = e.clientY - rect.top;
          const { height } = u.bbox;

          dragHandleY = mouseY;

          // Calculate new domain based on drag distance
          const yScaleKey = u.series[1]?.scale ?? 'y';
          const yScale = u.scales[yScaleKey];
          if (!yScale || yScale.min == null || yScale.max == null) return;

          const pixelRange = height;
          const dataRange = dragStartDomain[1] - dragStartDomain[0];
          const pixelsPerUnit = pixelRange / dataRange;

          const deltaPixels = dragHandleY - dragStartY;
          const deltaData = deltaPixels / pixelsPerUnit;

          // Invert because y-axis is flipped (0 at top)
          const newMin = dragStartDomain[0] - deltaData;
          const newMax = dragStartDomain[1] - deltaData;

          // Apply minimum range constraint
          if (newMax - newMin >= minRange) {
            u.setScale(yScaleKey, { min: newMin, max: newMax });
          }

          u.redraw();
        };

        const handleMouseUp = () => {
          if (!dragging || !dragStartDomain) return;

          dragging = false;

          // Emit final domain
          const yScaleKey = u.series[1]?.scale ?? 'y';
          const yScale = u.scales[yScaleKey];
          if (yScale && yScale.min != null && yScale.max != null) {
            const finalDomain: [number, number] = [yScale.min, yScale.max];
            onYZoom?.(finalDomain);
          }

          dragStartDomain = null;
        };

        const handleMouseLeave = () => {
          if (dragging) {
            dragging = false;
            dragStartDomain = null;
          }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        // Store cleanup function
        (u as uPlot & { _yDragZoomCleanup?: () => void })._yDragZoomCleanup = () => {
          canvas.removeEventListener('mousedown', handleMouseDown);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
      },

      destroy: (u: uPlot) => {
        const cleanup = (u as uPlot & { _yDragZoomCleanup?: () => void })._yDragZoomCleanup;
        if (cleanup) cleanup();
      },
    },
  };
}