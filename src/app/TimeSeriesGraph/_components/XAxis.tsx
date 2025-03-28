import * as React from 'react';
import { ScaleLinear } from 'd3-scale';

interface AxisProps {
  title: string;
  formatter: (value: number | Date) => string;
}

interface XAxisProps extends AxisProps {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
}

/** determine number of ticks based on space available  */
function numTicksForPixels(
  pixelsAvailable: number,
  pixelsPerTick = 70,
): number {
  return Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick);
}

const XAxis: React.FC<XAxisProps> = ({
  xScale,
  title,
  formatter,
  innerHeight,
}) => {
  const [xMin, xMax] = xScale.range();
  const ticks = xScale.ticks(numTicksForPixels(xMax - xMin));

  return (
    <g data-testid="XAxis" transform={`translate(0 ${innerHeight})`}>
      <text
        x={xMax}
        textAnchor="end"
        dy={-4}
        fill="var(--gray-600)"
        className="font-semibold text-2xs"
        style={{
          textShadow: `-1px -1px 1px #fff,
            1px -1px 1px #fff,
            -1px 1px 1px #fff,
            1px 1px 1px #fff`,
        }}
      >
        {title}
      </text>

      <line x1={xMin} x2={xMax} y1={0} y2={0} stroke="var(--gray-400)" />
      {ticks.map((tick: number) => {
        const x = xScale(tick);
        return (
          <g key={tick} transform={`translate(${x} 0)`}>
            <text
              dy="0.71em"
              textAnchor="middle"
              fill="currentColor"
              className="text-gray-400 text-2xs"
            >
              {formatter(tick)}
            </text>
            <line y1={0} y2={8} stroke="var(--gray-300)" />
          </g>
        );
      })}
    </g>
  );
};

export default XAxis;
