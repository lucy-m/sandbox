import React from 'react';
import { interval } from 'rxjs';
import { SvgCircle } from '../shapes';
import { PointDisplay } from '../shapes/PointDisplay';
import { Spring, SpringFn } from '../shapes/spring';
import { getMouseEventCoords } from '../util/getMouseEventCoOrds';
import './Spring.css';

const initialPosition = { x: 30, y: 40 };
const initialVelocity = { x: 0, y: 0 };
const initialEndPoint = { x: 200, y: 200 };
const stiffness = 5;
const friction = 80;
const weight = 25;

const dt = 20;
const timer = interval(dt);

export const SpringDrawer: React.FC = () => {
  const [spring, setSpring] = React.useState<Spring>(
    SpringFn.makeSpring(
      initialPosition,
      initialVelocity,
      initialEndPoint,
      stiffness,
      friction,
      weight
    )
  );

  const [started, setStarted] = React.useState(true);

  React.useEffect(() => {
    const s = timer.subscribe(() => {
      if (started) {
        setSpring(SpringFn.tick(spring, dt));
      }
    });
    return () => s.unsubscribe();
  });

  const reset = () => setSpring(SpringFn.setPosition(spring, initialPosition));
  const startStop = () => setStarted(!started);

  const onCanvasClick = (e: React.MouseEvent) => {
    setSpring(SpringFn.setEndPoint(spring, getMouseEventCoords(e)));
  };

  return (
    <div>
      <h2>Spring</h2>
      <svg height={400} width={400} id="svg" onClick={onCanvasClick}>
        <SvgCircle position={spring.position} radius={10} fill="darkred" />
        <SvgCircle position={spring.endPoint} radius={3} fill="black" />
      </svg>
      <div>
        <ul>
          <li>
            Position <PointDisplay point={spring.position} />
          </li>
          <li>
            Velocity <PointDisplay point={spring.velocity} />
          </li>
        </ul>
      </div>
      <button onClick={startStop}>{started ? 'Stop' : 'Start'}</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
