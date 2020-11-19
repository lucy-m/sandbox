import React from 'react';
import { interval } from 'rxjs';
import { addPoint, Point, scale, SvgCircle } from '../shapes';
import { PointDisplay } from '../shapes/PointDisplay';
import { getMouseEventCoords } from '../util/getMouseEventCoOrds';
import './Spring.css';

const initialPosition = { x: 30, y: 40 };
const initialVelocity = { x: 0, y: 0 };
const initialEndPoint = { x: 200, y: 200 };
const stiffness = 6;
const friction = 40;
const weight = 100;

const timer = interval(20);

export const Spring: React.FC = () => {
  const [position, setPosition] = React.useState<Point>(initialPosition);
  const [endPoint, setEndPoint] = React.useState<Point>(initialEndPoint);
  const [velocity, setVelocity] = React.useState<Point>(initialVelocity);

  const [started, setStarted] = React.useState(true);

  React.useEffect(() => {
    const s = timer.subscribe(() => {
      if (started) {
        const d = addPoint(position, scale(endPoint, -1));
        const springAcc = scale(d, -stiffness / weight);
        const frictionAcc = scale(velocity, -friction / weight);
        const acc = addPoint(springAcc, frictionAcc);

        setVelocity(addPoint(velocity, acc));

        setPosition(addPoint(position, velocity));
      }
    });
    return () => s.unsubscribe();
  });

  const reset = () => setPosition(initialPosition);
  const startStop = () => setStarted(!started);
  const onCanvasClick = (e: React.MouseEvent) => {
    setEndPoint(getMouseEventCoords(e));
  };

  return (
    <div>
      <h2>Spring</h2>
      <svg height={400} width={400} id="svg" onClick={onCanvasClick}>
        <SvgCircle position={position} radius={10} fill="darkred" />
        <SvgCircle position={endPoint} radius={3} fill="black" />
      </svg>
      <div>
        <ul>
          <li>
            Position <PointDisplay point={position} />
          </li>
          <li>
            Velocity <PointDisplay point={velocity} />
          </li>
        </ul>
      </div>
      <button onClick={startStop}>{started ? 'Stop' : 'Start'}</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
