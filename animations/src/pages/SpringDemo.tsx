import React from 'react';
import { interval, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Point, Zero } from '../shapes';
import {
  Sharp,
  Smooth,
  SmoothAsymm,
  VertexShape,
} from '../shapes/vertex-bezier';
import { getMouseEventCoords } from '../util/getMouseEventCoOrds';
import './Spring.css';
import { letters } from './spring/letters';
import {
  makeSpringBezierMaker,
  SpringBezier,
  SpringBezierShape,
} from './SpringBezier';
import { SpringCircle } from './SpringCircle';

const dt = 20;
const timer = interval(dt).pipe(mapTo(dt));

const bezierMaker = makeSpringBezierMaker({
  friction: 70,
  stiffness: 12,
  weight: 10,
});

const vertexShapeToSpringBezier = (
  vertexShape: VertexShape
): SpringBezierShape => {
  const start = bezierMaker(vertexShape.start);
  const subsequent = vertexShape.subsequent.map(bezierMaker);

  return { start, subsequent };
};

export const SpringDemo: React.FC = () => {
  const [started, setStarted] = React.useState(true);
  const [circleEndPoint] = React.useState(new Subject<Point>());
  const [nudge] = React.useState(new Subject<Point>());
  const [shapeMorph] = React.useState(new Subject<VertexShape>());

  const onCanvasClick = (e: React.MouseEvent) => {
    circleEndPoint.next(getMouseEventCoords(e));
  };

  const start = bezierMaker(Sharp({ x: 10, y: 60 }));
  const subsequent = [
    bezierMaker(Sharp({ x: 100, y: 24 })),
    bezierMaker(Smooth({ x: 120, y: 80 }, { x: -20, y: -3 })),
    bezierMaker(SmoothAsymm({ x: 180, y: 60 }, { x: -12, y: -12 }, Zero)),
    bezierMaker(Smooth({ x: 170, y: 160 }, { x: -40, y: 0 })),
    bezierMaker(SmoothAsymm({ x: 210, y: 55 }, Zero, { x: 20, y: -10 })),
    bezierMaker(Sharp({ x: 300, y: 100 })),
    bezierMaker(Sharp({ x: 300, y: 150 })),
    bezierMaker(Smooth({ x: 270, y: 150 }, { x: 45, y: 100 })),
  ];

  const nudgeUp = () => nudge.next({ x: 0, y: -100 });
  const nudgeDown = () => nudge.next({ x: 0, y: 100 });

  const reset = () => {};
  const startStop = () => setStarted(!started);
  const morphA = () => shapeMorph.next(letters.A);
  const morphB = () => shapeMorph.next(letters.B);
  const morphC = () => shapeMorph.next(letters.C);

  return (
    <div>
      <h2>Spring</h2>
      <svg height={400} width={400} id="svg" onClick={onCanvasClick}>
        <SpringCircle
          endPoint={circleEndPoint}
          timer={timer}
          started={started}
        />
        <SpringBezier
          initial={{ start, subsequent }}
          timer={timer}
          started={started}
          nudge={nudge}
        />
        <SpringBezier
          initial={vertexShapeToSpringBezier(letters.A)}
          timer={timer}
          started={started}
          morph={shapeMorph}
        />
      </svg>
      <div>
        <ul></ul>
      </div>
      <button onClick={startStop}>{started ? 'Stop' : 'Start'}</button>
      <button onClick={reset}>Reset</button>
      <button onClick={nudgeUp}>Nudge up</button>
      <button onClick={nudgeDown}>Nudge down</button>
      <button onClick={morphA}>Morph A</button>
      <button onClick={morphB}>Morph B</button>
      <button onClick={morphC}>Morph C</button>
    </div>
  );
};
