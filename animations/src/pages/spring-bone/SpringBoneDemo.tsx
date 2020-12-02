import React from 'react';
import { p } from '../../shapes';
import { SpringBoneShape } from './spring-bone';
import { SpringBone } from './SpringBone';

const bone: SpringBoneShape = {
  start: p(0, 0),
  subsequent: [p(20, -10), p(50, 10), p(80, -15), p(100, 5), p(160, 5)],
};

export const SpringBoneDemo: React.FC = () => {
  return (
    <div>
      <h2>Spring Bone</h2>
      <svg height={400} width={400}>
        <SpringBone springBone={bone} origin={p(20, 120)} />
      </svg>
    </div>
  );
};
