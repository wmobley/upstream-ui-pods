import { useEffect, useRef } from 'react';
import { zoom } from 'd3-zoom';
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
 * Custom hook to set up and manage the d3 zoom behavior
 */
export function useChartBrush({
  overviewRef,
  innerWidth,
  overviewInnerHeight,
  overviewXScale,
  setViewDomain,
  onBrush,
}: UseChartBrushProps) {
  // Track if initial zoom has been set
  const initialZoomRef = useRef(false);
  // Store the zoom behavior for reset functionality
  const zoomBehaviorRef =
    useRef<ReturnType<typeof zoom<SVGGElement, unknown>>>();

  // Initialize zoom
  useEffect(() => {
    if (!overviewXScale || !overviewRef.current) return;

    // Create zoom behavior
    const zoomBehavior = zoom<SVGGElement, unknown>()
      .scaleExtent([1, 1000]) // Allow zooming from 1x to 32x
      .extent([
        [0, 0],
        [innerWidth, overviewInnerHeight],
      ])
      .translateExtent([
        [0, -Infinity],
        [innerWidth, Infinity],
      ])
      .wheelDelta((event) => {
        // Customize wheel zoom speed
        return -event.deltaY * 0.001;
      })
      .on('zoom', (event) => {
        if (!overviewXScale) return;

        // Get the zoomed x scale
        const xz = event.transform.rescaleX(overviewXScale);

        // Get the new domain
        const domain: [number, number] = [xz.domain()[0], xz.domain()[1]];

        // Update view domain
        setViewDomain(domain);
        onBrush?.(domain);
      });

    // Store zoom behavior for reset functionality
    zoomBehaviorRef.current = zoomBehavior;

    // Apply zoom to overview chart
    const zoomGroup = select(overviewRef.current);

    // Enable wheel events
    zoomGroup
      .attr('class', 'zoom-container')
      .style('pointer-events', 'all')
      .call(zoomBehavior);

    // Set initial zoom if not already set
    if (!initialZoomRef.current) {
      // Set initial zoom level
      zoomGroup.transition().duration(750).call(zoomBehavior.scaleTo, 1); // Start with no zoom

      initialZoomRef.current = true;
    }

    // Cleanup
    return () => {
      zoomGroup.on('.zoom', null);
    };
  }, [
    overviewXScale,
    overviewRef,
    innerWidth,
    overviewInnerHeight,
    setViewDomain,
    onBrush,
  ]);

  // Function to reset the zoom
  const resetZoom = () => {
    if (!overviewRef.current || !zoomBehaviorRef.current) return;

    const zoomGroup = select(overviewRef.current);
    zoomGroup
      .transition()
      .duration(750)
      .call(zoomBehaviorRef.current.scaleTo, 1);

    // Reset to full domain
    if (overviewXScale) {
      const domain: [number, number] = [
        overviewXScale.domain()[0],
        overviewXScale.domain()[1],
      ];
      setViewDomain(domain);
      onBrush?.(domain);
    }
  };

  return { resetZoom };
}
