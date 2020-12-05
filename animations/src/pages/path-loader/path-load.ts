import { Attempt, bind2, bindMany, makeFailure, makeSuccess } from 'luce-util';
import { VertexShape } from '../../shapes';
import { CommandType, ParsedCommand } from './parsers';
import { parseM } from './parsers/parse-m';

// spec here
// https://www.w3.org/TR/SVG/paths.html

const parseCommand = (commandStr: string): Attempt<ParsedCommand[]> => {
  const letter = commandStr[0];
  const lowerLetter = letter.toLowerCase();

  const tCommandType: Attempt<CommandType> = (() => {
    switch (lowerLetter) {
      case 'm':
        return makeSuccess<CommandType>('move');
      case 's':
        return makeSuccess<CommandType>('smooth');
      case 'l':
        return makeSuccess<CommandType>('line');
      case 'z':
        return makeSuccess<CommandType>('close');
      default:
        return makeFailure<CommandType>(['Unknown command letter ' + letter]);
    }
  })();

  const relative = letter === lowerLetter;

  const tParsedValues = bindMany(
    commandStr
      .slice(1)
      .split(',')
      .filter((s) => s !== '')
      .map((s) => {
        const parsed = Number.parseFloat(s);
        return isNaN(parsed)
          ? makeFailure<number>([`Unable to parse ${s} to number`])
          : makeSuccess(parsed);
      })
  );

  const parsedCommands: Attempt<ParsedCommand[]> = bind2(
    tCommandType,
    tParsedValues,
    (commandType, parsedValues) => {
      switch (commandType) {
        case 'move':
          return parseM(relative, parsedValues);
      }
      return makeSuccess<ParsedCommand[]>([]);
    }
  );

  return parsedCommands;
};

export const pathLoad = (path: string): Attempt<VertexShape> => {
  const commandRegex = /\w[\d.,]*/gi;
  const commands = Array.from(path.matchAll(commandRegex)).map(
    ([match]) => match
  );

  console.log(commands);

  const parsed = commands.map(parseCommand);

  console.log(parsed);

  return makeFailure([]);
};
