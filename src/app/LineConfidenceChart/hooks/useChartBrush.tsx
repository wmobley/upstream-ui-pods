import { useEffect, useRef } from 'react';
import { brushX } from 'd3-brush';
import { select } from 'd3-selection';
import { ScaleLinear } from 'd3-scale';

interface UseChartBrushProps {
  overviewRef: React.RefObject<SVGGElement>;
  innerWidth: number;
  overviewInnerHeight: number;
  overviewXScale: ScaleLinear<number, number> | undefined;
  setViewDomain: (domain: [number, number] | null) => void;
  onBrush?: (domain: [number, number]) => void;
}

/**
 * Custom hook to set up and manage the d3 brush behavior
 */
export function useChartBrush({
  overviewRef,
  innerWidth,
  overviewInnerHeight,
  overviewXScale,
  setViewDomain,
  onBrush,
}: UseChartBrushProps) {
  // Track if initial selection has been set
  const initialSelectionRef = useRef(false);

  // Initialize brush
  useEffect(() => {
    if (!overviewXScale || !overviewRef.current) return;

    // Create brush behavior
    const brush = brushX<unknown>()
      .extent([
        [0, 0],
        [innerWidth, overviewInnerHeight],
      ])
      .on('start', () => {
        // Mark that user has started brushing
        initialSelectionRef.current = true;
      })
      .on('brush', (event) => {
        if (!event.selection) return;
        const selection = event.selection as [number, number];

        // Convert pixel coordinates to domain values
        const domain: [number, number] = [
          overviewXScale.invert(selection[0]),
          overviewXScale.invert(selection[1]),
        ];

        // Update view domain
        setViewDomain(domain);
        onBrush?.(domain);
      });

    // Apply brush to overview chart
    const brushGroup = select(overviewRef.current);
    brushGroup.call(brush);

    // Set initial selection if not already set
    if (!initialSelectionRef.current) {
      // Calculate 50% width selection centered in the middle
      const selectionWidth = innerWidth * 0.5;
      const selectionStart = (innerWidth - selectionWidth) / 2;
      const selectionEnd = selectionStart + selectionWidth;

      brushGroup.call(brush.move, [selectionStart, selectionEnd]);

      // Trigger initial brush event
      if (overviewXScale) {
        const domain: [number, number] = [
          overviewXScale.invert(selectionStart),
          overviewXScale.invert(selectionEnd),
        ];
        setViewDomain(domain);
        onBrush?.(domain);
      }
    }

    // Cleanup
    return () => {
      brushGroup.on('.brush', null);
    };
  }, [
    overviewXScale,
    overviewRef,
    innerWidth,
    overviewInnerHeight,
    setViewDomain,
    onBrush,
  ]);
}
