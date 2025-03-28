import * as React from 'react';
import { ScaleLinear } from 'd3-scale';
import { line, curveCatmullRom } from 'd3-shape';

interface DataPoint {
  date: Date;
  value: number;
}

interface LineProps {
  data: DataPoint[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xAccessor: (d: DataPoint) => number | Date;
  yAccessor: (d: DataPoint) => number;
}

const Line: React.FC<LineProps> = ({
  data,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
}) => {
  const lineBuilder = line<DataPoint>()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)))
    .curve(curveCatmullRom.alpha(0.5));

  const path = lineBuilder(data);
  return <path d={path} stroke="#9a6fb0" fill="none" strokeWidth={2} />;
};

export default Line;
