import React from 'react';
import { interval, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { p, Point, Spring, SpringFn, Zero } from '../../shapes';
import './MapNavDemo.scss';
import { MapNodeDisplay } from './MapNode';
import { MapTheme } from './MapTheme';
import {
  buildNameNodeMap,
  circularMapNode,
  MapNode,
  rectangularMapNode,
} from './models/map-node';

const dt = 20;
const timer = interval(dt).pipe(mapTo(dt));

const target = new Subject<Point>();

const stiffness = 20;
const friction = 100;
const weight = 8;

const children: MapNode[] = [
  circularMapNode(p(-2000, 0), 'Project 1', [], [0, 0], 120, 120),
  circularMapNode(p(-1200, 4000), 'Project 2', [], [0, 0], 120, 60),
  circularMapNode(p(600, 3000), 'Child3', [], [0, 0], 120, 160),
  circularMapNode(p(3000, 0), 'Child4', [], [0, 0], 120, -120),
  rectangularMapNode(
    p(1000, -1200),
    'Child5',
    [
      rectangularMapNode(
        p(2200, -1800),
        'Child6',
        [],
        'left-to-right',
        600,
        800
      ),
    ],
    'bottom-to-top',
    400,
    300
  ),
];

const mapNode: MapNode = circularMapNode(
  p(0, 0),
  'Home',
  children,
  [-90, 90],
  240,
  0
);

const nameNodeMap = buildNameNodeMap(mapNode);

export const MapNavDemo: React.FC = () => {
  const [cameraPos, setCameraPos] = React.useState<Spring>(
    SpringFn.makeSpring(Zero, Zero, Zero, { stiffness, friction, weight })
  );

  React.useEffect(() => {
    const s = timer.subscribe((dt: number) =>
      setCameraPos(SpringFn.tick(cameraPos, dt))
    );

    return () => s.unsubscribe();
  });

  React.useEffect(() => {
    const s = target.subscribe((v) => {
      setCameraPos(SpringFn.setEndPoint(cameraPos, v));
    });
    return () => s.unsubscribe();
  });

  const onGoTo = (name: string): void => {
    const node = nameNodeMap.get(name);

    if (node) {
      target.next(node.center);
    }
  };

  return (
    <React.Fragment>
      <div>
        Camera position {cameraPos.position.x.toFixed(1)}{' '}
        {cameraPos.position.y.toFixed(1)}
      </div>
      <div className="map-nav-wrapper">
        <MapTheme cameraPos={cameraPos.position} />
        <div className="map-nav-camera-wrapper">
          <div
            className="map-nav-camera"
            style={{
              top: -cameraPos.position.y.toFixed(1),
              left: -cameraPos.position.x.toFixed(1),
            }}
          >
            <MapNodeDisplay mapNode={mapNode} onGoTo={onGoTo} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
