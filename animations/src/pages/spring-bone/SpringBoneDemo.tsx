import React from 'react';
import { interval, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { p, Point } from '../../shapes';
import { BoneShape } from './spring-bone';
import { SpringBone } from './SpringBone';

const bone: BoneShape = {
  start: p(0, 0),
  subsequent: [p(20, -10), p(50, 10), p(80, -15), p(100, 5), p(160, 5)],
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
          origin={p(20, 120)}
          nudge={nudge}
          timer={timer}
        />
      </svg>
      <div>
        <button onClick={nudgeUp}>Nudge up</button>
        <button onClick={nudgeDown}>Nudge down</button>
      </div>
    </div>
  );
};
