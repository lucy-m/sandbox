import React from 'react';
import { DrawingConfig } from '../../shapes';
import { VertexBezier } from '../../shapes/VertexBezier';
import { pathLoad } from './path-load';

const testPath =
  'M.73,76.59,70.78,1.47S58.6,101,110.37,101s8.63,73.6,8.63,73.6Z';
const result = pathLoad(testPath);
console.log(result);

const drawingConfig: DrawingConfig = {
  showMarkers: true,
  fill: 'hsl(30, 80%, 70%)',
};

export const PathLoaderDemo: React.FC = () => {
  return (
    <div>
      <h2>Path Loader</h2>
      <svg width={400} height={400}>
        {result.kind === 'success' ? (
          result.value.map((s, i) => (
            <VertexBezier shape={s} key={i} drawingConfig={drawingConfig} />
          ))
        ) : (
          <React.Fragment />
        )}
      </svg>
    </div>
  );
};
