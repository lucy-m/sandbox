import React from 'react';
import { Observable } from 'rxjs';
import { DrawingConfig, Point, Zero } from '../../shapes';
import { Spring, SpringFn } from '../../shapes/spring';
import { VertexBezier, VertexShape } from '../../shapes/VertexBezier';
import {
  SpringBezierFn,
  SpringBezierShape,
  SpringBezierVertex,
} from './spring-bezier-vertex';

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

  const [start, setStart] = React.useState<SpringBezierVertex>(
    props.initial.start
  );
  const [subsequent, setSubsequent] = React.useState<SpringBezierVertex[]>(
    props.initial.subsequent
  );

  React.useEffect(() => {
    const s = timer.subscribe((dt: number) => {
      if (started) {
        const fn = (s: Spring) => SpringFn.tick(s, dt);

        setStart(SpringBezierFn.apply(start, fn));
        setSubsequent(subsequent.map((s) => SpringBezierFn.apply(s, fn)));
      }
    });
    return () => s.unsubscribe();
  });

  React.useEffect(() => {
    const s = nudge?.subscribe((n: Point) => {
      const r = () => Math.random() * 3 - 1.5;
      const apply = (s: SpringBezierVertex): SpringBezierVertex => {
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
      };
      setStart(apply(start));
      setSubsequent(subsequent.map(apply));
    });
    return () => s?.unsubscribe();
  });

  React.useEffect(() => {
    const s = morph?.subscribe((shape: VertexShape) => {
      const springShape: SpringBezierShape = { start, subsequent };
      const morphed = SpringBezierFn.spacedMorph(springShape, shape);

      setStart(morphed.start);
      setSubsequent(morphed.subsequent);
    });

    return () => s?.unsubscribe();
  });

  const shape: VertexShape = {
    start: SpringBezierFn.toVertex(start),
    subsequent: subsequent.map(SpringBezierFn.toVertex),
  };

  const springs = props.showSprings ? (
    (() => {
      const shapes = SpringBezierFn.getSpringDisplays({ start, subsequent });
      const drawingConfig: DrawingConfig = {
        stroke: 'hsl(0, 100%, 85%)',
      };

      return shapes.map((s, i) => (
        <VertexBezier
          key={i}
          shape={s}
          drawingConfig={drawingConfig}
          origin={origin}
        />
      ));
    })()
  ) : (
    <React.Fragment />
  );

  return (
    <React.Fragment>
      {springs}
      <VertexBezier
        shape={shape}
        // drawingConfig={{ showMarkers: true }}
        origin={origin}
      />
    </React.Fragment>
  );
};
