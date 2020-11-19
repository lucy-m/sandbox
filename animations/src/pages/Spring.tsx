import React from 'react';
import { interval } from 'rxjs';
import { addPoint, Point, SvgCircle } from '../shapes';
import './Spring.css';

const initialPosition = { x: 30, y: 40 };
const timer = interval(100);

export const Spring: React.FC = () => {
  const [position, setPosition] = React.useState<Point>(initialPosition);

  React.useEffect(() => {
    const s = timer.subscribe(() =>
      setPosition(addPoint(position, { x: 5, y: 0 }))
    );
    return () => s.unsubscribe();
  });

  const reset = () => setPosition(initialPosition);

  return (
    <div>
      <h2>Spring</h2>
      <svg height={400} width={400}>
        <SvgCircle position={position} radius={10} fill="darkred" />
      </svg>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
