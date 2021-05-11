import React from 'react';
import { p } from '../../shapes';
import './MapNavDemo.css';
import { MapNodeDisplay } from './MapNode';
import { circularMapNode, MapNode } from './models/map-node';

const children: MapNode[] = [
  circularMapNode(p(200, 200), 'Child1', [], [0, 0], 30, 180),
  circularMapNode(p(200, 400), 'Child2', [], [0, 0], 30, 60),
  circularMapNode(p(400, 400), 'Child3', [], [0, 0], 30, 60),
  circularMapNode(p(600, 400), 'Child4', [], [0, 0], 30, -120),
  circularMapNode(p(600, 200), 'Child5', [], [0, 0], 30, -60),
];

const mapNode: MapNode = circularMapNode(
  p(400, 200),
  'Parent',
  children,
  [-90, 90],
  80,
  0
);

export const MapNavDemo: React.FC = () => {
  return (
    <div className="map-nav-wrapper">
      <MapNodeDisplay mapNode={mapNode} />
    </div>
  );
};
