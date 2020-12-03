import React from 'react';
import {
  DrawingConfig,
  Point,
  Sharp,
  Spring,
  VertexBezier,
  VertexShape,
} from '../../shapes';

interface SpringViewProps {
  springs: Spring[];
  origin?: Point;
}

export const SpringView: React.FC<SpringViewProps> = (
  props: SpringViewProps
) => {
  const { springs, origin } = props;

  const vertexShapes: VertexShape[] = springs.map((spring) => ({
    start: Sharp(spring.position),
    subsequent: [Sharp(spring.endPoint)],
  }));

  const drawingConfig: DrawingConfig = {
    stroke: 'hsl(0, 100%, 85%)',
  };

  return (
    <React.Fragment>
      {vertexShapes.map((s, i) => (
        <VertexBezier
          key={i}
          shape={s}
          drawingConfig={drawingConfig}
          origin={origin}
        />
      ))}
    </React.Fragment>
  );
};
