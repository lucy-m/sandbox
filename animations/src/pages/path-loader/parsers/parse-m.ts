import { Attempt, makeFailure, makeSuccess } from 'luce-util';
import { p } from '../../../shapes';
import { CommandParser, ParsedCommand } from './parser';

// https://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands

export const parseM: CommandParser = (
  relative: boolean,
  values: number[]
): Attempt<ParsedCommand[]> => {
  if (values.length < 2) {
    return makeFailure<ParsedCommand[]>(['Not enough values for move command']);
  } else if (values.length % 2 !== 0) {
    return makeFailure<ParsedCommand[]>([
      'Move command requires an even number of values',
    ]);
  } else {
    const points = Array.from({ length: values.length / 2 }).map((_, i) =>
      p(values[2 * i], values[2 * i + 1])
    );

    const moveCommand: ParsedCommand = {
      type: 'move',
      relative,
      position: points[0],
    };

    const lineToCommands: ParsedCommand[] = points.slice(1).map((p) => ({
      type: 'line',
      relative,
      position: p,
    }));

    return makeSuccess([moveCommand, ...lineToCommands]);
  }
};
