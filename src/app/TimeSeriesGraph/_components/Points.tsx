import * as React from 'react';
import { ScaleLinear } from 'd3-scale';

interface DataPoint {
  date: Date;
  value: number;
}

interface PointsProps {
  data: DataPoint[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xAccessor: (d: DataPoint) => number | Date;
  yAccessor: (d: DataPoint) => number;
  radius: number;
}

const Points: React.FC<PointsProps> = ({
  data,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
  radius,
}) => {
  return (
    <g>
      {data.map((d) => (
        <circle
          key={d.date.getTime()}
          cx={xScale(xAccessor(d))}
          cy={yScale(yAccessor(d))}
          r={radius}
        />
      ))}
    </g>
  );
};

export default Points;
