import {
  Attempt,
  bind,
  bind2,
  bindMany,
  makeFailure,
  makeSuccess,
  map,
} from 'luce-util';
import {
  addPoint,
  Point,
  SmoothAsymm,
  Vertex,
  VertexShape,
  verticesToShape,
  Zero,
} from '../../shapes';
import {
  CommandType,
  getInGradient,
  getOutGradient,
  ParsedCommand,
} from './parsers';
import { parseC } from './parsers/parse-c';
import { parseL } from './parsers/parse-l';
import { parseM } from './parsers/parse-m';
import { parseS } from './parsers/parse-s';
import { parseZ } from './parsers/parse-z';

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
      case 'c':
        return makeSuccess<CommandType>('curve');
      default:
        return makeFailure<CommandType>(['Unknown command letter ' + letter]);
    }
  })();

  const relative = letter === lowerLetter;

  const valueRegex = /-?[\d.]+/g;
  const values = Array.from(commandStr.matchAll(valueRegex)).map(
    ([match]) => match
  );
  const tParsedValues = bindMany(
    values.map((s) => {
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
        case 'smooth':
          return parseS(relative, parsedValues);
        case 'line':
          return parseL(relative, parsedValues);
        case 'close':
          return parseZ(relative, parsedValues);
        case 'curve':
          return parseC(relative, parsedValues);
      }
    }
  );

  return parsedCommands;
};

const toShape = (commands: ParsedCommand[]): Attempt<VertexShape[]> => {
  if (commands.length === 0) {
    return makeSuccess([]);
  } else {
    interface Acc {
      lastPoint: Point;
      finishedShapes: VertexShape[];
      workingVertices: Vertex[];
    }

    const firstCommand = commands[0];
    if (firstCommand.type !== 'move' || firstCommand.relative) {
      return makeFailure(['Must start with an absolute move command']);
    } else {
      const startVertex = SmoothAsymm(
        firstCommand.position,
        Zero,
        getOutGradient(firstCommand, commands[1])
      );

      const initial: Acc = {
        lastPoint: firstCommand.position,
        finishedShapes: [],
        workingVertices: [startVertex],
      };

      const result = commands.slice(1).reduce((acc, command, i) => {
        if (command.type === 'close') {
          const shape = verticesToShape(acc.workingVertices, true);
          const finishedShapes =
            shape.kind === 'success'
              ? [...acc.finishedShapes, shape.value]
              : acc.finishedShapes;
          const lastPoint =
            shape.kind === 'success'
              ? shape.value.start.position
              : acc.lastPoint;

          return {
            lastPoint,
            finishedShapes,
            workingVertices: [],
          };
        } else {
          const nextCommand = commands[i + 2];

          const position = command.relative
            ? addPoint(acc.lastPoint, command.position)
            : command.position;
          const inGrad = getInGradient(command);
          const outGrad = getOutGradient(command, nextCommand);

          const vertex = SmoothAsymm(position, inGrad, outGrad);

          if (command.type === 'move') {
            // start a new shape
            const shape = verticesToShape(acc.workingVertices, false);
            const finishedShapes =
              shape.kind === 'success'
                ? [...acc.finishedShapes, shape.value]
                : acc.finishedShapes;
            const workingVertices = [vertex];

            return {
              lastPoint: position,
              finishedShapes,
              workingVertices,
            };
          } else {
            return {
              lastPoint: position,
              finishedShapes: acc.finishedShapes,
              workingVertices: [...acc.workingVertices, vertex],
            };
          }
        }
      }, initial);

      const lastShape = verticesToShape(result.workingVertices, false);
      const finishedShapes =
        lastShape.kind === 'success'
          ? [...result.finishedShapes, lastShape.value]
          : result.finishedShapes;

      return makeSuccess(finishedShapes);
    }
  }
};

export const pathLoad = (path: string): Attempt<VertexShape[]> => {
  const commandRegex = /\w[-\d.,]*/gi;
  const commands = Array.from(path.matchAll(commandRegex)).map(
    ([match]) => match
  );

  const tParsed = map(bindMany(commands.map(parseCommand)), (commands) =>
    commands.reduce((a, b) => a.concat(b), [])
  );

  const shape = bind(tParsed, toShape);

  return shape;
};
