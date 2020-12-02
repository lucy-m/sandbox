import React from 'react';
import { Observable } from 'rxjs';
import {
  addPoint,
  getPoints,
  Point,
  SpringFn,
  SpringProperties,
  toVertexShape,
  VertexBezier,
} from '../../shapes';
import { SpringView } from '../spring/SpringView';
import { BoneShape, tick, toSpringShape } from './spring-bone';

interface SpringBoneProps {
  springBone: BoneShape;
  origin?: Point;
  timer: Observable<number>;
  nudge?: Observable<Point>;
  showSprings?: boolean;
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

  const springDisplay = props.showSprings ? (
    <SpringView springs={getPoints(shape)} origin={props.origin} />
  ) : (
    <React.Fragment />
  );

  return (
    <React.Fragment>
      {springDisplay}
      <VertexBezier shape={toVertexShape(shape)} origin={props.origin} />
    </React.Fragment>
  );
};
