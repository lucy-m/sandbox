import React from 'react';
import { interval, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Point, Zero } from '../shapes';
import { getMouseEventCoords } from '../util/getMouseEventCoOrds';
import './Spring.css';
import { makeSpringBezierMaker, SpringBezier } from './SpringBezier';
import { SpringCircle } from './SpringCircle';

const dt = 20;
const timer = interval(dt).pipe(mapTo(dt));

const bezierMaker = makeSpringBezierMaker({
  friction: 54,
  stiffness: 5,
  weight: 25,
});

export const SpringDemo: React.FC = () => {
  const [started, setStarted] = React.useState(true);
  const [circleEndPoint] = React.useState(new Subject<Point>());
  const [nudge] = React.useState(new Subject<Point>());

  const reset = () => {};
  const startStop = () => setStarted(!started);

  const onCanvasClick = (e: React.MouseEvent) => {
    circleEndPoint.next(getMouseEventCoords(e));
  };

  const start = bezierMaker({ x: 10, y: 60 });
  const subsequent = [
    bezierMaker({ x: 100, y: 24 }),
    bezierMaker({ x: 120, y: 80 }, { x: 20, y: 3 }),
    bezierMaker({ x: 180, y: 60 }, { x: 12, y: 12 }, Zero),
    bezierMaker({ x: 170, y: 160 }, { x: 40, y: 0 }),
    bezierMaker({ x: 210, y: 55 }, Zero, { x: -20, y: 10 }),
    bezierMaker({ x: 300, y: 100 }),
    bezierMaker({ x: 300, y: 150 }),
    bezierMaker({ x: 270, y: 150 }, { x: -45, y: -100 }),
  ];

  const nudgeUp = () => nudge.next({ x: 0, y: -100 });
  const nudgeDown = () => nudge.next({ x: 0, y: 100 });

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
          start={start}
          subsequent={subsequent}
          timer={timer}
          started={started}
          nudge={nudge}
        />
      </svg>
      <div>
        <ul></ul>
      </div>
      <button onClick={startStop}>{started ? 'Stop' : 'Start'}</button>
      <button onClick={reset}>Reset</button>
      <button onClick={nudgeUp}>Nudge up</button>
      <button onClick={nudgeDown}>Nudge down</button>
    </div>
  );
};
