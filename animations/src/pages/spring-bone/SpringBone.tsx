import React from 'react';
import { Point, VertexBezier } from '../../shapes';
import { SpringBoneShape, toVertexShape } from './spring-bone';

interface SpringBoneProps {
  springBone: SpringBoneShape;
  origin?: Point;
}

export const SpringBone: React.FC<SpringBoneProps> = (
  props: SpringBoneProps
) => {
  const vertexShape = toVertexShape(props.springBone);

  return (
    <VertexBezier
      shape={vertexShape}
      showMarkers={true}
      origin={props.origin}
    />
  );
};
