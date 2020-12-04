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
  p,
  Point,
  Sharp,
  Vertex,
  VertexShape,
} from '../../../shapes';

// https://www.w3.org/TR/SVG/paths.html

type Handler = (
  command: string,
  lastPosition: Point | undefined
) => Attempt<{ vertices: Vertex[]; lastPoint: Point }>;

type CommandType = 'relative' | 'absolute';

export const handleM = (
  command: string,
  lastPoint: Point | undefined
): Attempt<{ vertices: Vertex[]; origin: Point; lastPoint: Point }> => {
  // this command expects pairs of numbers separated by commas
  // the first pair is the move to command
  // subsequent pairs are line to commands
  const letter = command[0];
  const tNumbers = bindMany(
    command
      .slice(1)
      .split(',')
      .map((s) => Number.parseFloat(s))
      .map((n) =>
        isNaN(n)
          ? makeFailure<number>(['Could not parse number ' + n])
          : makeSuccess(n)
      )
  );

  const tNumberPairs = bind(tNumbers, (numbers) => {
    if (numbers.length < 2) {
      return makeFailure<[number, number][]>([
        'Not enough number count in move command',
      ]);
    } else if (numbers.length % 2 !== 0) {
      return makeFailure<[number, number][]>([
        'Odd number count in move command',
      ]);
    } else {
      const pairs = Array.from({ length: numbers.length / 2 }).map((_, i) => {
        const first = numbers[2 * i];
        const second = numbers[2 * i] + 1;
        return [first, second] as [number, number];
      });
      return makeSuccess(pairs);
    }
  });

  const tCommandType: Attempt<CommandType> = (() => {
    if (letter === 'm') {
      return makeSuccess<CommandType>('relative');
    } else if (letter === 'M') {
      return makeSuccess<CommandType>('absolute');
    } else {
      return makeFailure<CommandType>([
        'Unable to parse move command ' + command,
      ]);
    }
  })();

  const tVertices = bind2(
    tCommandType,
    tNumberPairs,
    (commandType, numberPairs) => {
      const tFirstPoint = (() => {
        const pair = numberPairs[0];
        const point = p(pair[0], pair[1]);
        switch (commandType) {
          case 'absolute':
            return makeSuccess(point);
          case 'relative':
            if (lastPoint) {
              return makeSuccess(addPoint(lastPoint, point));
            } else {
              return makeFailure<Point>([
                'Previous point is required for relative move command',
              ]);
            }
        }
      })();

      const subsequentPoints = numberPairs.slice(1).map(([x, y]) => p(x, y));

      return map(tFirstPoint, (firstPoint) => ({
        firstPoint,
        subsequentPoints,
      }));
    }
  );

  const shape = map(tVertices, ({ firstPoint, subsequentPoints }) => {
    const origin = firstPoint;
    const lastPoint = subsequentPoints.slice(-1)[0] ?? firstPoint;
    const vertices = subsequentPoints.map((p) => Sharp(p));

    return { origin, lastPoint, vertices };
  });

  return shape;
};

export const pathLoad = (path: string): Attempt<VertexShape> => {
  const commandRegex = /\w[\d.,]*/gi;
  const commands = Array.from(path.matchAll(commandRegex)).map(
    ([match]) => match
  );

  console.log(commands);

  const m = handleM(commands[0], undefined);

  console.log(m);

  return makeFailure([]);
};
