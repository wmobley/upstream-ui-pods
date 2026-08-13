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
  const brushBehaviorRef = useRef<ReturnType<typeof brushX<unknown>>>();
  const lastDomainRef = useRef<[number, number] | null>(null);
  const selectionDomainRef = useRef<[number, number] | null>(null);

  const domainsEqual = (
    first: [number, number] | null,
    second: [number, number],
  ) =>
    Boolean(
      first &&
        Math.abs(first[0] - second[0]) < 1 &&
        Math.abs(first[1] - second[1]) < 1,
    );

  useEffect(() => {
    if (
      !overviewXScale ||
      !overviewRef.current ||
      innerWidth <= 0 ||
      overviewInnerHeight <= 0
    ) {
      return;
    }

    const fullDomain = overviewXScale.domain() as [number, number];

    const emitDomain = (domain: [number, number]) => {
      const normalizedDomain: [number, number] = [
        Math.min(domain[0], domain[1]),
        Math.max(domain[0], domain[1]),
      ];

      selectionDomainRef.current = normalizedDomain;

      if (domainsEqual(lastDomainRef.current, normalizedDomain)) {
        return;
      }

      lastDomainRef.current = normalizedDomain;
      setViewDomain(normalizedDomain);
      onBrush?.(normalizedDomain);
    };

    const brushBehavior = brushX<unknown>()
      .extent([
        [0, 0],
        [innerWidth, overviewInnerHeight],
      ])
      .on('brush end', (event) => {
        if (!event.selection) {
          emitDomain(fullDomain);
          return;
        }

        const selection = event.selection as [number, number];
        emitDomain([
          overviewXScale.invert(selection[0]),
          overviewXScale.invert(selection[1]),
        ]);
      });

    brushBehaviorRef.current = brushBehavior;

    const brushGroup = select(overviewRef.current);
    brushGroup.selectAll('*').remove();
    brushGroup.call(brushBehavior);

    const styleBrush = () => {
      brushGroup
        .selectAll('.overlay')
        .attr('cursor', 'crosshair')
        .attr('fill', 'transparent');

      brushGroup
        .selectAll('.selection')
        .attr('fill', '#e0f2f1')
        .attr('fill-opacity', 0.35)
        .attr('stroke', '#0f8f80')
        .attr('stroke-width', 1.5);

      brushGroup
        .selectAll('.handle')
        .attr('fill', '#ffffff')
        .attr('stroke', '#0f8f80')
        .attr('stroke-width', 1.5);
    };

    const selectedDomain = selectionDomainRef.current ?? fullDomain;
    brushGroup.call(brushBehavior.move, [
      overviewXScale(selectedDomain[0]),
      overviewXScale(selectedDomain[1]),
    ]);
    styleBrush();

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

  const resetZoom = () => {
    if (!overviewRef.current || !brushBehaviorRef.current || !overviewXScale) {
      return;
    }

    const fullDomain = overviewXScale.domain() as [number, number];
    selectionDomainRef.current = fullDomain;
    lastDomainRef.current = fullDomain;
    setViewDomain(fullDomain);
    onBrush?.(fullDomain);

    const brushGroup = select(overviewRef.current);
    brushGroup
      .transition()
      .duration(300)
      .call(brushBehaviorRef.current.move, [
        overviewXScale(fullDomain[0]),
        overviewXScale(fullDomain[1]),
      ]);
  };

  return { resetZoom };
}
