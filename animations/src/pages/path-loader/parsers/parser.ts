import { Attempt } from 'luce-util';
import { Point } from '../../../shapes';

export type CommandType = 'move' | 'line' | 'smooth' | 'close';

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

export type ParsedCommand =
  | MoveCommand
  | LineCommand
  | SmoothCommand
  | CloseCommand;

export type CommandParser = (
  relative: boolean,
  values: number[]
) => Attempt<ParsedCommand[]>;
