import { Attempt } from 'luce-util';
import { addPoint, p, Point, scale, subPoint, Zero } from '../../../shapes';

export type CommandType =
  | 'move'
  | 'line'
  | 'horz'
  | 'vert'
  | 'smooth'
  | 'close'
  | 'curve';

export interface MoveCommand {
  type: 'move';
  relative: boolean;
  position: Point;
}

export interface LineCommand {
  type: 'line';
  relative: boolean;
  position: Point;
}

export interface HorzCommand {
  type: 'horz';
  relative: boolean;
  x: number;
}

export interface VertCommand {
  type: 'vert';
  relative: boolean;
  y: number;
}

export interface SmoothCommand {
  type: 'smooth';
  relative: boolean;
  position: Point;
  control: Point;
}

export interface CloseCommand {
  type: 'close';
}

export interface CurveCommand {
  type: 'curve';
  relative: boolean;
  position: Point;
  control1: Point;
  control2: Point;
}

export type ParsedCommand =
  | MoveCommand
  | LineCommand
  | HorzCommand
  | VertCommand
  | SmoothCommand
  | CloseCommand
  | CurveCommand;

export type CommandParser = (
  relative: boolean,
  values: number[]
) => Attempt<ParsedCommand[]>;

export const getInGradient = (command: ParsedCommand | undefined): Point => {
  switch (command?.type) {
    case undefined:
    case 'line':
    case 'horz':
    case 'vert':
    case 'close':
    case 'move':
      return Zero;
    case 'smooth':
      return subPoint(command.control, command.position);
    case 'curve':
      return subPoint(command.control2, command.position);
  }
};

export const getOutGradient = (
  position: Point,
  command: ParsedCommand,
  nextCommand: ParsedCommand | undefined
): Point => {
  switch (nextCommand?.type) {
    case undefined:
    case 'line':
    case 'horz':
    case 'vert':
    case 'close':
    case 'move':
      return Zero;
    case 'smooth':
      // The first control point is assumed to be the reflection
      // of the second control point on the previous command relative to the current point.
      // (If there is no previous command or if the previous command was not an C, c, S or s,
      // assume the first control point is coincident with the current point.)
      return scale(getInGradient(command), -1);
    case 'curve':
      return nextCommand.relative
        ? nextCommand.control1
        : subPoint(nextCommand.control1, position);
  }
};

export const getNextPosition = (
  position: Point,
  command: ParsedCommand
): Point => {
  if (command.type === 'horz') {
    const x = command.relative ? position.x + command.x : command.x;
    return p(x, position.y);
  } else if (command.type === 'vert') {
    const y = command.relative ? position.y + command.y : command.y;
    return p(position.x, y);
  } else if (command.type === 'close') {
    return position;
  } else {
    return command.relative
      ? addPoint(position, command.position)
      : command.position;
  }
};
