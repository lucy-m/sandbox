import React from 'react';
import { Observable } from 'rxjs';
import {
  addPoint,
  Point,
  SpringFn,
  SpringProperties,
  toVertexShape,
  VertexBezier,
} from '../../shapes';
import { BoneShape, tick, toSpringShape } from './spring-bone';

interface SpringBoneProps {
  springBone: BoneShape;
  origin?: Point;
  timer: Observable<number>;
  nudge?: Observable<Point>;
}

const springProperties: SpringProperties = {
  friction: 70,
  weight: 10,
  stiffness: 10,
};

export const SpringBone: React.FC<SpringBoneProps> = (
  props: SpringBoneProps
) => {
  const { nudge, timer, springBone } = props;

  const [shape, setShape] = React.useState(
    toSpringShape(props.springBone, springProperties)
  );

  React.useEffect(() => {
    const s = timer.subscribe((dt) => {
      const ticked = tick(shape, springBone, dt);
      setShape(ticked);
    });
    return () => s.unsubscribe();
  });

  React.useEffect(() => {
    const s = nudge?.subscribe((n: Point) => {
      const start = SpringFn.setEndPoint(
        shape.start,
        addPoint(shape.start.endPoint, n)
      );
      const newShape = { ...shape, start };
      setShape(newShape);
    });
    return () => s?.unsubscribe();
  });

  return <VertexBezier shape={toVertexShape(shape)} origin={props.origin} />;
};
