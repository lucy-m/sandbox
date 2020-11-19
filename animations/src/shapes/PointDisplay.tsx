import React from 'react';
import { Point } from '.';

interface PointDisplayProps {
  point: Point;
}

export const PointDisplay: React.FC<PointDisplayProps> = (
  props: PointDisplayProps
) => {
  const { point } = props;

  const format = (n: number): string => n.toLocaleString();

  return (
    <React.Fragment>
      x {format(point.x)} y {format(point.y)}
    </React.Fragment>
  );
};
