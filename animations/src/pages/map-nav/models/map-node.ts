import { addPoint, Point, scale } from '../../../shapes';
import { polarToCartesian } from './polar/polar-to-cartesian';

export type LinkDirection = 'forward' | 'backwards';

export interface MapLinkPoint {
  name: string;
  position: Point;
  tangent: Point;
}

export interface MapLink {
  from: MapLinkPoint;
  to: MapLinkPoint;
}

interface MapNodeBase {
  position: Point;
  inPoint: Point;
  inTangent: Point;
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
      const tangent = scale(localPosition, -1);

      return { name, position: linkPosition, tangent };
    })();

    const to: MapLinkPoint = {
      name: c.name,
      position: c.inPoint,
      tangent: c.inTangent,
    };

    return { from, to };
  });

  const inTangent = polarToCartesian({ radius, theta: inAngle });
  const inPoint = addPoint(position, inTangent);

  return {
    kind: 'circular',
    position,
    name,
    children,
    links,
    radius,
    inPoint,
    inTangent,
  };
};

export const buildNameNodeMap = (root: MapNode): Map<string, MapNode> => {
  const map = new Map<string, MapNode>();

  const buildInner = (toCheck: MapNode[]): Map<string, MapNode> => {
    const next = toCheck[0];
    if (next !== undefined) {
      if (map.has(next.name)) {
        throw new Error('Duplicate node names');
      }
      map.set(next.name, next);
      return buildInner(toCheck.slice(1).concat(next.children));
    } else {
      return map;
    }
  };

  return buildInner([root]);
};
