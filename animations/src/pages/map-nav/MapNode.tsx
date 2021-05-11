import React from 'react';
import { addPoint, p, SvgLine } from '../../shapes';
import { MapNode } from './models/map-node';

interface MapNodeDisplayProps {
  mapNode: MapNode;
}

export const MapNodeDisplay: React.FC<MapNodeDisplayProps> = (
  props: MapNodeDisplayProps
) => {
  const { mapNode } = props;

  const children = mapNode.children.map((c) => (
    <MapNodeDisplay key={c.name} mapNode={c} />
  ));

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

  const links = mapNode.links.map((link) => {
    const key = link.to.name + '-' + link.from.name;
    const left = Math.min(link.to.position.x, link.from.position.x);
    const top = Math.min(link.to.position.y, link.from.position.y);
    const width = Math.abs(link.to.position.x - link.from.position.x) + 1;
    const height = Math.abs(link.to.position.y - link.from.position.y) + 1;

    const linePosOffset = p(-left, -top);
    const toPoint = addPoint(linePosOffset, link.to.position);
    const fromPoint = addPoint(linePosOffset, link.from.position);

    const line = <SvgLine start={fromPoint} end={toPoint} />;

    const svg = (
      <svg key={key} width={width} height={height} style={{ top, left }}>
        {line}
      </svg>
    );

    return svg;
  });

  return (
    <React.Fragment>
      {nodeDisplay}
      {children}
      {links}
    </React.Fragment>
  );
};
