import { Attempt, makeFailure, makeSuccess } from 'luce-util';
import { p } from '../../../shapes';
import { CommandParser, CurveCommand, ParsedCommand } from './parsed-command';

// https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands

export const parseC: CommandParser = (
  relative: boolean,
  values: number[]
): Attempt<ParsedCommand[]> => {
  if (values.length < 6) {
    return makeFailure<ParsedCommand[]>([
      'Not enough values for curve command',
    ]);
  } else if (values.length % 6 !== 0) {
    return makeFailure<ParsedCommand[]>([
      'Curve command requires 6n variables',
    ]);
  } else {
    const points = Array.from({ length: values.length / 6 }).map((_, i) => {
      const control1 = p(values[6 * i], values[6 * i + 1]);
      const control2 = p(values[6 * i + 2], values[6 * i + 3]);
      const position = p(values[6 * i + 4], values[6 * i + 5]);

      return { position, control1, control2 };
    });

    const commands: CurveCommand[] = points.map(
      ({ position, control1, control2 }) => ({
        type: 'curve',
        relative,
        position,
        control1,
        control2,
      })
    );

    return makeSuccess(commands);
  }
};
