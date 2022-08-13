import React from 'react';
import { interval, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { p, Point, SpringProperties } from '../../shapes';
import { BoneShape } from './spring-bone';
import { SpringBone } from './SpringBone';

const bone: BoneShape = {
  start: p(0, 0),
  subsequent: Array.from({ length: 10 }).map((_, i) => p(i * 10, 0)),
};

const springProperties: SpringProperties = {
  friction: 12,
  weight: 2,
  stiffness: 2,
};

const dt = 20;
const timer = interval(dt).pipe(mapTo(dt));
const nudge = new Subject<Point>();

export const SpringBoneDemo: React.FC = () => {
  const nudgeDown = () => nudge.next(p(0, 30));
  const nudgeUp = () => nudge.next(p(0, -30));

  return (
    <div>
      <h2>Spring Bone</h2>
      <svg height={400} width={400}>
        <SpringBone
          springBone={bone}
          springProperties={springProperties}
          origin={p(20, 120)}
          nudge={nudge}
          timer={timer}
          showSprings={true}
        />
      </svg>
      <div>
        <button onClick={nudgeUp}>Nudge up</button>
        <button onClick={nudgeDown}>Nudge down</button>
      </div>
    </div>
  );
};
