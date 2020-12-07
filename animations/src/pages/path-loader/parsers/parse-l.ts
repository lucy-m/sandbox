import { Attempt, makeFailure, makeSuccess } from 'luce-util';
import { p } from '../../../shapes';
import { CommandParser, LineCommand, ParsedCommand } from './parser';

export const parseL: CommandParser = (
  relative: boolean,
  values: number[]
): Attempt<ParsedCommand[]> => {
  if (values.length < 2) {
    return makeFailure<ParsedCommand[]>([
      'Not enough values for lineTo command',
    ]);
  } else if (values.length % 2 !== 0) {
    return makeFailure<ParsedCommand[]>([
      'LineTo command requires even number of variables',
    ]);
  } else {
    const points = Array.from({ length: values.length / 2 }).map((_, i) => {
      const x = values[2 * i];
      const y = values[2 * i + 1];

      return p(x, y);
    });

    const commands: LineCommand[] = points.map((p) => ({
      type: 'line',
      relative,
      position: p,
    }));

    return makeSuccess(commands);
  }
};
