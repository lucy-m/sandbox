import { Attempt } from 'luce-util';
import { addPoint, Point, scale, Zero } from '../../../shapes';

export type CommandType = 'move' | 'line' | 'smooth' | 'close' | 'curve';

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
    case 'close':
    case 'move':
      return Zero;
    case 'smooth':
      return addPoint(command.control, scale(command.position, -1));
    case 'curve':
      return addPoint(command.control2, scale(command.position, -1));
  }
};

export const getOutGradient = (
  command: ParsedCommand,
  nextCommand: ParsedCommand | undefined
): Point => {
  switch (nextCommand?.type) {
    case undefined:
    case 'line':
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
      return addPoint(nextCommand.control1, scale(nextCommand.position, -1));
  }
};
