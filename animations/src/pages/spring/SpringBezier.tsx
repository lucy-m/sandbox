import React from 'react';
import { Observable } from 'rxjs';
import { Point, ShapeFn, Zero } from '../../shapes';
import { Spring, SpringFn } from '../../shapes/spring';
import { VertexBezier, VertexShape } from '../../shapes/VertexBezier';
import {
  SpringBezierFn,
  SpringBezierShape,
  SpringBezierVertex,
} from './spring-bezier-vertex';
import { SpringView } from './SpringView';

interface SpringBezierProps {
  initial: SpringBezierShape;
  origin?: Point;
  timer: Observable<number>;
  started: boolean;
  nudge?: Observable<Point>;
  morph?: Observable<VertexShape>;
  showSprings?: boolean;
}

export const SpringBezier: React.FC<SpringBezierProps> = (
  props: SpringBezierProps
) => {
  const { timer, started, nudge, morph } = props;
  const origin = props.origin ?? Zero;

  const [shape, setShape] = React.useState<SpringBezierShape>(props.initial);

  React.useEffect(() => {
    const s = timer.subscribe((dt: number) => {
      if (started) {
        const fn = (s: Spring) => SpringFn.tick(s, dt);

        const updated = ShapeFn.map(shape, (s) => SpringBezierFn.apply(s, fn));
        setShape(updated);
      }
    });
    return () => s.unsubscribe();
  });

  React.useEffect(() => {
    const s = nudge?.subscribe((n: Point) => {
      const r = () => Math.random() * 3 - 1.5;
      const updated = ShapeFn.map(
        shape,
        (s: SpringBezierVertex): SpringBezierVertex => {
          const position = SpringFn.setVelocity(
            SpringFn.nudgeEndPoint(s.position, n),
            { x: r(), y: r() }
          );
          const inGradient =
            s.inGradient &&
            SpringFn.setVelocity(s.inGradient, { x: r(), y: r() });
          const outGradient =
            s.outGradient &&
            SpringFn.setVelocity(s.outGradient, { x: r(), y: r() });

          return { ...s, position, inGradient, outGradient };
        }
      );
      setShape(updated);
    });
    return () => s?.unsubscribe();
  });

  React.useEffect(() => {
    const s = morph?.subscribe((vertexShape: VertexShape) => {
      const morphed = SpringBezierFn.spacedMorph(shape, vertexShape);
      setShape(morphed);
    });

    return () => s?.unsubscribe();
  });

  const vertexShape: VertexShape = ShapeFn.map(shape, SpringBezierFn.toVertex);

  const springs = props.showSprings ? (
    (() => {
      const springs = ShapeFn.getPoints(shape).map((v) => v.position);
      return <SpringView springs={springs} origin={origin} />;
    })()
  ) : (
    <React.Fragment />
  );

  return (
    <React.Fragment>
      {springs}
      <VertexBezier
        shape={vertexShape}
        // drawingConfig={{ showMarkers: true }}
        origin={origin}
      />
    </React.Fragment>
  );
};
