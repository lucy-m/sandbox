import hsl from 'hsl-to-hex';
import React from 'react';
import { p, Sharp, VertexBezier, VertexShape } from '../../shapes';

export const ParTesDemo: React.FC = () => {
  const minX = 300;
  const minY = 0;

  const width = 140;
  const height = 90;
  const skew = -10;

  const initialH = 216;
  const initialS = 0;
  const initialL = 30;

  const stepH = 0;
  const stepS = 1;
  const stepL = -2;

  const parallelogram: VertexShape = {
    start: Sharp(p(0, 0)),
    subsequent: [
      Sharp(p(width, 0)),
      Sharp(p(width + skew, height)),
      Sharp(p(skew, height)),
    ],
  };

  const xs = Array.from({ length: 10 });
  const ys = Array.from({ length: 10 });

  const parallelograms = xs.flatMap((_, i) =>
    ys.map((_, j) => {
      const key = `${i},${j}`;
      const d = i + j;
      const h = initialH + d * stepH;
      const s = initialS + d * stepS;
      const l = initialL + d * stepL;

      const fill = hsl(h, s, l);

      const x = i * width + j * skew + minX;
      const y = j * height + minY;

      return (
        <VertexBezier
          key={key}
          shape={parallelogram}
          origin={p(x, y)}
          drawingConfig={{ fill, stroke: fill }}
        />
      );
    })
  );

  return (
    <div className="par-tes-wrapper">
      <svg height={1000} width={1200} viewBox="0 0 1200 1000">
        {parallelograms}
      </svg>
    </div>
  );
};
