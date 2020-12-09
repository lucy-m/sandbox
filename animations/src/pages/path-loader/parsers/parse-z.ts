import { Attempt, makeSuccess } from 'luce-util';
import { CommandParser, ParsedCommand } from './parsed-command';

export const parseZ: CommandParser = (): Attempt<ParsedCommand[]> =>
  makeSuccess([{ type: 'close' }]);
