import React from 'react';
import { addPoint, Point } from './point';
import SvgCircle from './svg-circle';
import SvgLine from './svg-line';

const markerSize = 1.5;
const markerColours = {
  move: 'black',
  line: 'red',
  curve: 'blue',
};

export interface SvgPathCommand {
  draw: () => string;
  move: (start: Point) => Point;
  markers: (start: Point) => JSX.Element;
}

export const MoveAbs = (point: Point): SvgPathCommand => {
  const draw = () => `M ${point.x},${point.y}`;
  const move = () => point;
  const markers = () => (
    <SvgCircle position={point} radius={markerSize} fill={markerColours.move} />
  );

  return { draw, move, markers };
};

export const MoveRel = (dp: Point): SvgPathCommand => {
  const draw = () => `m ${dp.x},${dp.y}`;
  const move = (start: Point) => addPoint(start, dp);
  const markers = (start: Point) => (
    <SvgCircle
      position={addPoint(start, dp)}
      radius={markerSize}
      fill={markerColours.move}
    />
  );

  return { draw, move, markers };
};

export const LineAbs = (point: Point): SvgPathCommand => {
  const draw = () => `L ${point.x},${point.y}`;
  const move = () => point;
  const markers = () => (
    <SvgCircle position={point} radius={markerSize} fill={markerColours.line} />
  );

  return { draw, move, markers };
};

export const LineRel = (dp: Point): SvgPathCommand => {
  const draw = () => `l ${dp.x},${dp.y}`;
  const move = (start: Point) => addPoint(start, dp);
  const markers = (start: Point) => (
    <SvgCircle
      position={addPoint(start, dp)}
      radius={markerSize}
      fill={markerColours.line}
    />
  );

  return { draw, move, markers };
};

export const CurveAbs = (
  endPoint: Point,
  startControl: Point,
  endControl: Point
): SvgPathCommand => {
  const draw = () =>
    `C ${startControl.x},${startControl.y},${endControl.x},${endControl.y},${endPoint.x},${endPoint.y}`;
  const move = () => endPoint;
  const markers = () => (
    <SvgCircle
      position={endPoint}
      radius={markerSize}
      fill={markerColours.curve}
    />
  );

  return { draw, move, markers };
};

export const CurveRel = (
  dp: Point,
  startControlRel: Point,
  endControlRel: Point
): SvgPathCommand => {
  const endControlFromStart = addPoint(dp, endControlRel);
  const draw = () =>
    `c ${startControlRel.x},${startControlRel.y},${endControlFromStart.x},${endControlFromStart.y},${dp.x},${dp.y}`;
  const move = (start: Point) => addPoint(start, dp);
  const markers = (start: Point) => {
    const endPointMarker = (
      <SvgCircle
        position={addPoint(start, dp)}
        radius={markerSize}
        fill={markerColours.curve}
      />
    );
    const startControlPointMarker = (
      <SvgLine
        start={start}
        end={addPoint(start, startControlRel)}
        stroke={markerColours.curve}
      />
    );
    const endControlPointMarker = (
      <SvgLine
        start={move(start)}
        end={addPoint(move(start), endControlRel)}
        stroke={markerColours.curve}
      />
    );

    return (
      <g>
        {startControlPointMarker}
        {endControlPointMarker}
        {endPointMarker}
      </g>
    );
  };

  return { draw, move, markers };
};
