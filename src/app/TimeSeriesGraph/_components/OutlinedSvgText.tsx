import * as React from 'react';

interface OutlinedSvgTextProps {
  stroke: string;
  strokeWidth: number;
  children: React.ReactNode;
  [key: string]: unknown;
}

const OutlinedSvgText: React.FC<OutlinedSvgTextProps> = ({
  stroke,
  strokeWidth,
  children,
  ...other
}) => {
  return (
    <>
      <text stroke={stroke} strokeWidth={strokeWidth} {...other}>
        {children}
      </text>
      <text {...other}>{children}</text>
    </>
  );
};

export default OutlinedSvgText;
