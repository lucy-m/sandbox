import React from 'react';
import { Point } from './point';
import { MoveAbs, SvgPathCommand } from './svg-path-commands';

export interface DrawingConfig {
  stroke?: string;
  showMarkers?: boolean;
}

interface SvgPathProps {
  start: Point;
  commands: Array<SvgPathCommand>;
  drawingConfig?: DrawingConfig;
}

export const SvgPath: React.FC<SvgPathProps> = (props) => {
  const initial = MoveAbs(props.start);
  const d = props.commands.reduce(
    (str, command) => str + command.draw(),
    initial.draw()
  );
  const stroke = props.drawingConfig?.stroke ?? 'black';
  const path = <path d={d} stroke={stroke} fill="none" />;
  if (!props.drawingConfig?.showMarkers) {
    return path;
  }
  const endSegmentMarkers = props.commands.reduce(
    ({ segmentStart, acc }, command, i) => {
      return {
        segmentStart: command.move(segmentStart),
        acc: acc.concat(<g key={i + 1}>{command.markers(segmentStart)}</g>),
      };
    },
    {
      segmentStart: props.start,
      acc: [<g key={0}>{initial.markers(props.start)}</g>],
    }
  ).acc;

  return (
    <g>
      {path}
      {endSegmentMarkers}
    </g>
  );
};
