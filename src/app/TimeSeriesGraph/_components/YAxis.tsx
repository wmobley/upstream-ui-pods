import * as React from 'react';
import { ScaleLinear } from 'd3-scale';
import OutlinedSvgText from './OutlinedSvgText';

interface AxisProps {
  title: string;
  formatter: (value: number | Date) => string;
}

interface YAxisProps extends AxisProps {
  yScale: ScaleLinear<number, number>;
}

/** determine number of ticks based on space available  */
function numTicksForPixels(
  pixelsAvailable: number,
  pixelsPerTick = 70,
): number {
  return Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick);
}

const YAxis: React.FC<YAxisProps> = ({ yScale, title, formatter }) => {
  const [yMin, yMax] = yScale.range();
  const ticks = yScale.ticks(numTicksForPixels(yMin - yMax, 50));

  return (
    <g data-testid="YAxis">
      <OutlinedSvgText
        stroke="#fff"
        strokeWidth={2.5}
        dx={4}
        dy="0.8em"
        fill="var(--gray-600)"
        className="font-semibold text-2xs"
      >
        {title}
      </OutlinedSvgText>

      <line x1={0} x2={0} y1={yMin} y2={yMax} stroke="var(--gray-400)" />
      {ticks.map((tick: number) => {
        const y = yScale(tick);
        return (
          <g key={tick} transform={`translate(0 ${y})`}>
            <text
              dy="0.34em"
              textAnchor="end"
              dx={-12}
              fill="currentColor"
              className="text-gray-400 text-2xs"
            >
              {formatter(tick)}
            </text>
            <line x1={0} x2={-8} stroke="var(--gray-300)" />
          </g>
        );
      })}
    </g>
  );
};

export default YAxis;
