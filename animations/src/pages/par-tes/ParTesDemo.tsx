import React from 'react';
import { p, Sharp, VertexBezier, VertexShape } from '../../shapes';

export const ParTesDemo: React.FC = () => {
  const width = 140;
  const height = 90;
  const skew = -20;

  const initialH = 220;
  const initialS = 40;
  const initialL = 40;

  const stepH = 3;
  const stepS = 1;
  const stepL = 4;

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

  const parallelograms = xs.flatMap((_, x) =>
    ys.map((_, y) => {
      const key = `${x},${y}`;
      const d = x + y;
      const h = initialH + d * stepH;
      const s = initialS + d * stepS;
      const l = initialL + d * stepL;

      const fill = `hsl(${h}, ${s}%, ${l}%)`;

      return (
        <VertexBezier
          key={key}
          shape={parallelogram}
          origin={p(x * width + y * skew, y * height)}
          drawingConfig={{ fill, stroke: fill }}
        />
      );
    })
  );

  return (
    <div className="par-tes-wrapper">
      <svg height={600} width={1200}>
        {parallelograms}
      </svg>
    </div>
  );
};
