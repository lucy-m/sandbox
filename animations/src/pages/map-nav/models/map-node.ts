import { addPoint, Point } from '../../../shapes';
import { polarToCartesian } from './polar/polar-to-cartesian';

export type LinkDirection = 'forward' | 'backwards';

export interface MapLinkPoint {
  name: string;
  position: Point;
}

export interface MapLink {
  from: MapLinkPoint;
  to: MapLinkPoint;
}

interface MapNodeBase {
  position: Point;
  inPoint: Point;
  name: string;
  children: MapNode[];
  links: MapLink[];
}

export interface CircularMapNode extends MapNodeBase {
  kind: 'circular';
  radius: number;
}

export interface RectangularFlowMapNode extends MapNodeBase {
  kind: 'rectangular-flow';
}

export type MapNode = CircularMapNode;

export const circularMapNode = (
  position: Point,
  name: string,
  children: MapNode[],
  angleRange: [number, number],
  radius: number,
  inAngle: number
): CircularMapNode => {
  const startAngle = angleRange[0];
  const angleStep = (() => {
    if (children.length <= 1) {
      return 0;
    }

    return (angleRange[1] - angleRange[0]) / (children.length - 1);
  })();

  const links: MapLink[] = children.map((c, i) => {
    const from: MapLinkPoint = (() => {
      const theta = startAngle + angleStep * i;
      const localPosition = polarToCartesian({ radius, theta });
      const linkPosition = addPoint(position, localPosition);

      return { name, position: linkPosition };
    })();

    const to: MapLinkPoint = { name: c.name, position: c.inPoint };

    return { from, to };
  });

  const inPoint = (() => {
    const localPosition = polarToCartesian({ radius, theta: inAngle });
    return addPoint(position, localPosition);
  })();

  return {
    kind: 'circular',
    position,
    name,
    children,
    links,
    radius,
    inPoint,
  };
};
