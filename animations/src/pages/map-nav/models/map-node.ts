import { addPoint, p, Point, scale } from '../../../shapes';
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
  center: Point;
  topLeft: Point;
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

export type RectangularFlowDirection =
  | 'left-to-right'
  | 'right-to-left'
  | 'top-to-bottom'
  | 'bottom-to-top';

export interface RectangularFlowMapNode extends MapNodeBase {
  kind: 'rectangular-flow';
  flowDirection: RectangularFlowDirection;
  width: number;
  height: number;
}

export type MapNode = CircularMapNode | RectangularFlowMapNode;

export const circularMapNode = (
  center: Point,
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
      const linkPosition = addPoint(center, localPosition);
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
  const inPoint = addPoint(center, inTangent);
  const topLeft = addPoint(center, p(-radius, -radius));

  return {
    kind: 'circular',
    center,
    topLeft,
    name,
    children,
    links,
    radius,
    inPoint,
    inTangent,
  };
};

export const rectangularMapNode = (
  topLeft: Point,
  name: string,
  children: MapNode[],
  direction: RectangularFlowDirection,
  width: number,
  height: number
): RectangularFlowMapNode => {
  const linkStep = (() => {
    const linkCount = children.length + 1;

    switch (direction) {
      case 'left-to-right':
      case 'right-to-left':
        return height / linkCount;
      case 'top-to-bottom':
      case 'bottom-to-top':
        return width / linkCount;
    }
  })();

  const links: MapLink[] = children.map((c, i) => {
    const from: MapLinkPoint = (() => {
      const relX = (() => {
        switch (direction) {
          case 'left-to-right':
            return width;
          case 'right-to-left':
            return 0;
          case 'top-to-bottom':
          case 'bottom-to-top':
            return (i + 1) * linkStep;
        }
      })();

      const relY = (() => {
        switch (direction) {
          case 'left-to-right':
          case 'right-to-left':
            return (i + 1) * linkStep;
          case 'top-to-bottom':
            return height;
          case 'bottom-to-top':
            return 0;
        }
      })();

      const tangent = (() => {
        switch (direction) {
          case 'left-to-right':
            return p(-width, 0);
          case 'right-to-left':
            return p(width, 0);
          case 'top-to-bottom':
            return p(0, -height);
          case 'bottom-to-top':
            return p(0, height);
        }
      })();

      const linkPosition = addPoint(topLeft, p(relX, relY));

      return { name, position: linkPosition, tangent };
    })();

    const to: MapLinkPoint = {
      name: c.name,
      position: c.inPoint,
      tangent: c.inTangent,
    };

    return { from, to };
  });

  const inTangent = (() => {
    switch (direction) {
      case 'left-to-right':
        return p(-width, 0);
      case 'right-to-left':
        return p(width, 0);
      case 'top-to-bottom':
        return p(0, -height);
      case 'bottom-to-top':
        return p(0, height);
    }
  })();

  const inRelPoint = (() => {
    switch (direction) {
      case 'left-to-right':
        return p(0, height / 2);
      case 'right-to-left':
        return p(width, height / 2);
      case 'top-to-bottom':
        return p(width / 2, 0);
      case 'bottom-to-top':
        return p(width / 2, height);
    }
  })();

  const inPoint = addPoint(topLeft, inRelPoint);
  const center = addPoint(topLeft, p(width / 2, height / 2));

  return {
    kind: 'rectangular-flow',
    topLeft,
    center,
    name,
    children,
    links,
    flowDirection: direction,
    width,
    height,
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
