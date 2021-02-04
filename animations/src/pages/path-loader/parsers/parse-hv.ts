import { Attempt, makeSuccess } from 'luce-util';
import {
  CommandParser,
  HorzCommand,
  ParsedCommand,
  VertCommand,
} from './parsed-command';

const parseHV = (type: 'h' | 'v'): CommandParser => (
  relative: boolean,
  values: number[]
): Attempt<ParsedCommand[]> => {
  if (type === 'h') {
    const commands: HorzCommand[] = values.map((v) => ({
      type: 'horz',
      relative,
      x: v,
    }));

    return makeSuccess(commands);
  } else {
    const commands: VertCommand[] = values.map((v) => ({
      type: 'vert',
      relative,
      y: v,
    }));

    return makeSuccess(commands);
  }
};

export const parseH = parseHV('h');
export const parseV = parseHV('v');
