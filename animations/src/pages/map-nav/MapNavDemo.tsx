import React from 'react';
import { interval, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { addPoint, p, Point, Spring, SpringFn, Zero } from '../../shapes';
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
const nudge = new Subject<Point>();

const stiffness = 12;
const friction = 100;
const weight = 8;

const children: MapNode[] = [
  circularMapNode(p(-2000, 0), 'Project 1', [], [0, 0], 120, 120),
  circularMapNode(p(-1200, 4000), 'Project 2', [], [0, 0], 120, 60),
  circularMapNode(p(600, 3000), 'Project 3', [], [0, 0], 120, 160),
  circularMapNode(
    p(3000, 0),
    'Project 4',
    [circularMapNode(p(3400, 300), 'Some other info', [], [0, 0], 140, -120)],
    [0, 90],
    120,
    -120
  ),
  rectangularMapNode(
    p(1000, -1200),
    'Project 5',
    [
      rectangularMapNode(
        p(2200, -1800),
        'Lorem ipsum',
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
  140,
  0
);

const nameNodeMap = buildNameNodeMap(mapNode);

export const MapNavDemo: React.FC = () => {
  const [cameraPos, setCameraPos] = React.useState<Spring>(
    SpringFn.makeSpring(Zero, Zero, Zero, { stiffness, friction, weight })
  );
  const [followMouse, setFollowMouse] = React.useState(false);

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

  React.useEffect(() => {
    const s = nudge.subscribe((n) => {
      const newEndPoint = addPoint(cameraPos.endPoint, n);
      setCameraPos(SpringFn.setPositionAndEndpoint(cameraPos, newEndPoint));
    });
    return () => s.unsubscribe();
  });

  const onGoTo = (name: string): void => {
    const node = nameNodeMap.get(name);

    if (node) {
      target.next(node.center);
    }
  };

  const onMouseDown = () => setFollowMouse(true);
  const onMouseUp = () => setFollowMouse(false);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (followMouse) {
      const point = p(-e.movementX, -e.movementY);
      nudge.next(point);
    }
  };

  return (
    <div className="map-nav-wrapper">
      <div>
        Camera position {cameraPos.position.x.toFixed(1)}{' '}
        {cameraPos.position.y.toFixed(1)}
      </div>
      <div
        className="map-nav-display"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
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
    </div>
  );
};
