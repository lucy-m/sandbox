import React from 'react';
import {
  addPoint,
  p,
  scale,
  Smooth,
  VertexBezier,
  VertexShape,
} from '../../shapes';
import { MapNode } from './models/map-node';

interface MapNodeDisplayProps {
  mapNode: MapNode;
  onGoTo?: (name: string) => void;
}

export const MapNodeDisplay: React.FC<MapNodeDisplayProps> = (
  props: MapNodeDisplayProps
) => {
  const { mapNode } = props;

  const children = mapNode.children.map((c) => (
    <MapNodeDisplay key={c.name} mapNode={c} onGoTo={props.onGoTo} />
  ));

  const onGoTo = (name: string) => {
    if (props.onGoTo) {
      props.onGoTo(name);
    }
  };

  const nodeDisplay = (() => {
    if (mapNode.kind === 'circular') {
      const width = mapNode.radius * 2;
      const height = mapNode.radius * 2;
      const top = mapNode.position.y - mapNode.radius;
      const left = mapNode.position.x - mapNode.radius;

      return (
        <div
          className="map-node-display-wrapper circular"
          style={{ top, left, width, height }}
        >
          {mapNode.name}
        </div>
      );
    }
  })();

  const linkLabels = mapNode.links.map((link) => {
    const key = link.to.name + '-' + link.from.name;

    const toLabelPosition = addPoint(
      link.from.position,
      scale(link.from.tangent, -0.4)
    );
    const fromLabelPosition = addPoint(
      link.to.position,
      scale(link.to.tangent, 0.4)
    );

    return (
      <React.Fragment key={key}>
        <div
          className="map-node-link-label"
          style={{ left: toLabelPosition.x, top: toLabelPosition.y }}
          onClick={() => onGoTo(link.to.name)}
        >
          {link.to.name}
        </div>
        <div
          className="map-node-link-label"
          style={{ left: fromLabelPosition.x, top: fromLabelPosition.y }}
          onClick={() => onGoTo(link.from.name)}
        >
          {link.from.name}
        </div>
      </React.Fragment>
    );
  });

  const links = mapNode.links.map((link) => {
    const key = link.to.name + '-' + link.from.name;

    const boundingPoints = [
      link.to.position,
      addPoint(link.to.position, link.to.tangent),
      link.from.position,
      addPoint(link.from.position, scale(link.from.tangent, -1)),
    ];

    const minX = boundingPoints
      .map(({ x }) => x)
      .reduce((a, b) => Math.min(a, b));
    const maxX = boundingPoints
      .map(({ x }) => x)
      .reduce((a, b) => Math.max(a, b));
    const minY = boundingPoints
      .map(({ y }) => y)
      .reduce((a, b) => Math.min(a, b));
    const maxY = boundingPoints
      .map(({ y }) => y)
      .reduce((a, b) => Math.max(a, b));

    const left = minX;
    const top = minY;
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const linePosOffset = p(-left, -top);
    const toPoint = addPoint(linePosOffset, link.to.position);
    const fromPoint = addPoint(linePosOffset, link.from.position);

    const bezier: VertexShape = {
      start: Smooth(fromPoint, link.from.tangent),
      subsequent: [Smooth(toPoint, link.to.tangent)],
    };

    const svg = (
      <svg key={key} width={width} height={height} style={{ top, left }}>
        <VertexBezier shape={bezier} drawingConfig={{ showMarkers: false }} />
      </svg>
    );

    return svg;
  });

  return (
    <React.Fragment>
      {nodeDisplay}
      {children}
      {links}
      {linkLabels}
    </React.Fragment>
  );
};
