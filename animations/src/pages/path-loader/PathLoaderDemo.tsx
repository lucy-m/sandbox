import React from 'react';
import { DrawingConfig } from '../../shapes';
import { VertexBezier } from '../../shapes/VertexBezier';
import { pathLoad } from './path-load';

const testPath =
  'M22.3,133.8c-8.5,12.9,1,29.5,12.4,23.6s12.2-16.6,2.3-21.8S22.3,133.8,22.3,133.8z';
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
