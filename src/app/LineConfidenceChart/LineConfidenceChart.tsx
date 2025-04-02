import * as React from 'react';
import { extent, min, max } from 'd3-array';
import { scaleTime, scaleLinear } from 'd3-scale';
import { line, area, curveCatmullRom } from 'd3-shape';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { AggregatedMeasurement } from '@upstream/upstream-api';

interface LineConfidenceChartProps {
  data: AggregatedMeasurement[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const LineConfidenceChart: React.FC<LineConfidenceChartProps> = ({
  data,
  width = 800,
  height = 400,
  margin = { top: 20, right: 30, bottom: 30, left: 40 },
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear any existing content
    select(svgRef.current).selectAll('*').remove();

    // Calculate dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = scaleTime()
      .domain(
        extent(data, (d: AggregatedMeasurement) => d.measurementTime) as [
          Date,
          Date,
        ],
      )
      .range([0, innerWidth]);

    const yScale = scaleLinear()
      .domain([
        min(
          data,
          (d: AggregatedMeasurement) => d.parametricLowerBound,
        ) as number,
        max(
          data,
          (d: AggregatedMeasurement) => d.parametricUpperBound,
        ) as number,
      ])
      .range([innerHeight, 0]);

    // Create SVG
    const svg = select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create confidence interval area
    const confidenceArea = area<AggregatedMeasurement>()
      .x((d: AggregatedMeasurement) => xScale(d.measurementTime))
      .y0((d: AggregatedMeasurement) => yScale(d.parametricLowerBound))
      .y1((d: AggregatedMeasurement) => yScale(d.parametricUpperBound));

    svg
      .append('path')
      .datum(data)
      .attr('fill', '#9a6fb0')
      .attr('fill-opacity', 0.2)
      .attr('d', confidenceArea);

    // Create median line
    const medianLine = line<AggregatedMeasurement>()
      .x((d: AggregatedMeasurement) => xScale(d.measurementTime))
      .y((d: AggregatedMeasurement) => yScale(d.medianValue))
      .curve(curveCatmullRom.alpha(0.5));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#9a6fb0')
      .attr('stroke-width', 2)
      .attr('d', medianLine);

    // Add points
    svg
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d: AggregatedMeasurement) => xScale(d.measurementTime))
      .attr('cy', (d: AggregatedMeasurement) => yScale(d.value))
      .attr('r', 4)
      .attr('fill', '#9a6fb0')
      .attr('opacity', 0.6)
      .on('mouseover', function () {
        select(this).attr('r', 6).attr('opacity', 1);
      })
      .on('mouseout', function () {
        select(this).attr('r', 4).attr('opacity', 0.6);
      });

    // Add axes
    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale);

    svg
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    svg.append('g').call(yAxis);

    // Add tooltip
    const tooltip = select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('pointer-events', 'none');

    // Add tooltip events to points
    svg
      .selectAll<SVGCircleElement, AggregatedMeasurement>('circle')
      .on('mouseover', function (event: MouseEvent, d: AggregatedMeasurement) {
        tooltip
          .style('opacity', 1)
          .html(
            `Time: ${d.measurementTime.toLocaleString()}<br/>
             Value: ${d.value.toFixed(2)}<br/>
             Median: ${d.medianValue.toFixed(2)}<br/>
             Confidence Interval: [${d.parametricLowerBound.toFixed(2)}, ${d.parametricUpperBound.toFixed(2)}]<br/>
             Point Count: ${d.pointCount}`,
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mousemove', function (event: MouseEvent) {
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0);
      });

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [data, width, height, margin]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineConfidenceChart;
