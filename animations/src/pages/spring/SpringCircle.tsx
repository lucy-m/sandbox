import React from 'react';
import { Observable } from 'rxjs';
import { Point, SvgCircle } from '../../shapes';
import { Spring, SpringFn } from '../../shapes/spring';

const initialPosition = { x: 30, y: 40 };
const initialVelocity = { x: 0, y: 0 };
const stiffness = 5;
const friction = 80;
const weight = 25;

interface SpringCircleProps {
  endPoint: Observable<Point>;
  timer: Observable<number>;
  started: boolean;
}

export const SpringCircle: React.FC<SpringCircleProps> = (
  props: SpringCircleProps
) => {
  const { endPoint, timer, started } = props;
  const [spring, setSpring] = React.useState<Spring>(
    SpringFn.makeSpring(initialPosition, initialVelocity, initialPosition, {
      stiffness,
      friction,
      weight,
    })
  );

  React.useEffect(() => {
    const s = timer.subscribe((dt: number) => {
      if (started) {
        setSpring(SpringFn.tick(spring, dt));
      }
    });
    return () => s.unsubscribe();
  });

  React.useEffect(() => {
    const s = endPoint.subscribe((v) => {
      setSpring(SpringFn.setEndPoint(spring, v));
    });
    return () => s.unsubscribe();
  });

  return <SvgCircle position={spring.position} radius={10} fill="darkred" />;
};
