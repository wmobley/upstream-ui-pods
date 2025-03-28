import * as React from 'react';
import { ScaleLinear } from 'd3-scale';
import { line, curveCatmullRom, area } from 'd3-shape';

interface DataPoint {
  date: Date;
  value: number;
}

interface AreaProps {
  data: DataPoint[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xAccessor: (d: DataPoint) => number | Date;
  yAccessor: (d: DataPoint) => number;
}

const Area: React.FC<AreaProps> = ({
  data,
  xScale,
  yScale,
  xAccessor,
  yAccessor,
}) => {
  const areaBuilder = area<DataPoint>()
    .x((d) => xScale(xAccessor(d)))
    .y0((d) => yScale(0))
    .y1((d) => yScale(yAccessor(d)));

  const path = areaBuilder(data);
  return <path d={path} stroke="#9a6fb0" fill="#9a6fb0" strokeWidth={2} />;
};

export default Area;
