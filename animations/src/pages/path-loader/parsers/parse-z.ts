import { Attempt, makeSuccess } from 'luce-util';
import { CommandParser, ParsedCommand } from './parser';

export const parseZ: CommandParser = (): Attempt<ParsedCommand[]> =>
  makeSuccess([{ type: 'close' }]);
