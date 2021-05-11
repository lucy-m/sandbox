import React from 'react';
import { interval, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { p, Point, Spring, SpringFn, Zero } from '../../shapes';
import './MapNavDemo.css';
import { MapNodeDisplay } from './MapNode';
import { circularMapNode, MapNode } from './models/map-node';

const dt = 20;
const timer = interval(dt).pipe(mapTo(dt));

const target = new Subject<Point>();

const stiffness = 8;
const friction = 100;
const weight = 15;

const children: MapNode[] = [
  circularMapNode(p(-2000, 0), 'Child1', [], [0, 0], 80, 120),
  circularMapNode(p(-1200, 4000), 'Child2', [], [0, 0], 80, 60),
  circularMapNode(p(600, 3000), 'Child3', [], [0, 0], 80, 160),
  circularMapNode(p(3000, 0), 'Child4', [], [0, 0], 80, -120),
  circularMapNode(p(3000, -3800), 'Child5', [], [0, 0], 80, -60),
];

const mapNode: MapNode = circularMapNode(
  p(0, 0),
  'Parent',
  children,
  [-90, 90],
  240,
  0
);

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

  const onGoTo = (p: Point): void => {
    target.next(p);
  };

  return (
    <React.Fragment>
      <div className="map-nav-wrapper">
        <div className="map-nav-camera-wrapper">
          <div
            className="map-nav-camera"
            style={{ top: -cameraPos.position.y, left: -cameraPos.position.x }}
          >
            <MapNodeDisplay mapNode={mapNode} onGoTo={onGoTo} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
