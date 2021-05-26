import React from 'react';
import meImg from './images/me and shark.jpeg';
import { RootNode } from './models/map-node';
import { getNodeContent } from './NodeContent';

interface MapRootNodeProps {
  mapNode: RootNode;
}

export const MapRootNode: React.FC<MapRootNodeProps> = (
  props: MapRootNodeProps
) => {
  const { mapNode } = props;
  const width = mapNode.width;
  const height = mapNode.height;
  const top = mapNode.topLeft.y;
  const left = mapNode.topLeft.x;
  const content = getNodeContent(mapNode);

  return (
    <div
      className="map-node-display-wrapper root-node"
      style={{ top, left, width, height }}
    >
      <img className="me-img" src={meImg} alt="Me" />
      <div className="content">{content}</div>
    </div>
  );
};
