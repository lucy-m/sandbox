import React from 'react';
import { p, Zero } from '../../shapes';
import { Sharp, VertexBezier, VertexShape } from '../../shapes/VertexBezier';

const shape: VertexShape = {
  start: Sharp(Zero),
  subsequent: [Sharp(p(100, 0)), Sharp(p(100, 100)), Sharp(p(0, 100))],
  closed: true,
};

export const PathLoaderDemo: React.FC = () => {
  return (
    <div>
      <h2>Path Loader</h2>
      <svg width={400} height={400}>
        <VertexBezier
          shape={shape}
          origin={p(200, 200)}
          drawingConfig={{ showMarkers: true, fill: 'hsl(30, 80%, 70%)' }}
        />
      </svg>
    </div>
  );
};
