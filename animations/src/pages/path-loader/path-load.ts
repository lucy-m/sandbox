import {
  Attempt,
  bind,
  bind2,
  bindMany,
  makeFailure,
  makeSuccess,
  map,
  valueOr,
} from 'luce-util';
import {
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
  getNextPosition,
  getOutGradient,
  ParsedCommand,
} from './parsers';
import { parseC } from './parsers/parse-c';
import { parseH, parseV } from './parsers/parse-hv';
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
      case 'h':
        return makeSuccess<CommandType>('horz');
      case 'v':
        return makeSuccess<CommandType>('vert');
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
        case 'horz':
          return parseH(relative, parsedValues);
        case 'vert':
          return parseV(relative, parsedValues);
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
        getOutGradient(firstCommand.position, firstCommand, commands[1])
      );

      const initial: Acc = {
        lastPoint: firstCommand.position,
        finishedShapes: [],
        workingVertices: [startVertex],
      };

      const result = commands.slice(1).reduce((acc, command, i) => {
        if (command.type === 'close') {
          const tShape = verticesToShape(acc.workingVertices, true);
          const finishedShapes = valueOr(
            map(tShape, (shape) => [...acc.finishedShapes, shape]),
            () => acc.finishedShapes
          );
          const lastPoint = valueOr(
            map(tShape, (shape) => shape.start.position),
            () => acc.lastPoint
          );

          return {
            lastPoint,
            finishedShapes,
            workingVertices: [],
          };
        } else {
          const nextCommand = commands[i + 2];

          const position = getNextPosition(acc.lastPoint, command);

          const inGrad = getInGradient(command);
          const outGrad = getOutGradient(position, command, nextCommand);

          const vertex = SmoothAsymm(position, inGrad, outGrad);

          if (command.type === 'move') {
            // start a new shape
            const tShape = verticesToShape(acc.workingVertices, false);
            const finishedShapes = valueOr(
              map(tShape, (shape) => [...acc.finishedShapes, shape]),
              () => acc.finishedShapes
            );
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

      const tLastShape = verticesToShape(result.workingVertices, false);
      const finishedShapes = valueOr(
        map(tLastShape, (lastShape) => [...result.finishedShapes, lastShape]),
        () => result.finishedShapes
      );

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
