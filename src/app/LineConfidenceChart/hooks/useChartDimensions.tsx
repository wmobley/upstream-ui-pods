import { useState, useEffect } from 'react';
import { calculateChartDimensions } from '../utils/chartUtils';

interface UseChartDimensionsProps {
  containerRef: React.RefObject<HTMLDivElement>;
  width?: number;
  height?: number;
  margin: { top: number; right: number; bottom: number; left: number };
}

/**
 * Custom hook to manage chart dimensions and handle resize events
 */
export function useChartDimensions({
  containerRef,
  width,
  height,
  margin,
}: UseChartDimensionsProps) {
  // Add state for dimensions
  const [dimensions, setDimensions] = useState({
    width: width || 1000,
    height: height || 800,
  });

  // Use resize observer to update dimensions when container size changes
  useEffect(() => {
    // If explicit width and height are provided, or no container ref, skip observer
    if (!containerRef.current || (width && height)) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, width, height]);

  // Calculate dimensions for main and overview charts
  const chartDimensions = calculateChartDimensions(
    dimensions.width,
    dimensions.height,
    margin,
  );

  return { dimensions, chartDimensions };
}
