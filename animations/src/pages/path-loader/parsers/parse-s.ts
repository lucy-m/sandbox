import { Attempt, makeFailure, makeSuccess } from 'luce-util';
import { p } from '../../../shapes';
import { CommandParser, ParsedCommand, SmoothCommand } from './parser';

// https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands

export const parseS: CommandParser = (
  relative: boolean,
  values: number[]
): Attempt<ParsedCommand[]> => {
  if (values.length < 4) {
    return makeFailure<ParsedCommand[]>([
      'Not enough values for smooth command',
    ]);
  } else if (values.length % 4 !== 0) {
    return makeFailure<ParsedCommand[]>([
      'Smooth command requires 4n variables',
    ]);
  } else {
    const points = Array.from({ length: values.length / 4 }).map((_, i) => {
      const control = p(values[4 * i], values[4 * i + 1]);
      const position = p(values[4 * i + 2], values[4 * i + 3]);

      return { position, control };
    });

    const commands: SmoothCommand[] = points.map(({ position, control }) => ({
      type: 'smooth',
      relative,
      position,
      control,
    }));

    return makeSuccess(commands);
  }
};
