import React from 'react';
import { p, Zero } from '../../shapes';
import { Sharp, VertexBezier, VertexShape } from '../../shapes/VertexBezier';
import { pathLoad } from './path-load';

const shape: VertexShape = {
  start: Sharp(Zero),
  subsequent: [Sharp(p(100, 0)), Sharp(p(100, 100)), Sharp(p(0, 100))],
  closed: true,
};

const testPath =
  'M.73,76.59,70.78,1.47S58.6,101,110.37,101s8.63,73.6,8.63,73.6Z';
const result = pathLoad(testPath);

export const PathLoaderDemo: React.FC = () => {
  return (
    <div>
      <h2>Path Loader</h2>
      <svg width={400} height={400}>
        <VertexBezier
          shape={shape}
          drawingConfig={{ showMarkers: true, fill: 'hsl(30, 80%, 70%)' }}
        />
      </svg>
    </div>
  );
};
