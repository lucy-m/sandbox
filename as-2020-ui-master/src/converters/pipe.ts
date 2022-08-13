import {
  TimeConverter,
  PositionConverter,
  TimePositionConverter,
  Time,
  Position
} from './model';
import { timeNoOp, positionNoOp } from './no-op-pipes';

export const FullPipe = (params: {
  timeConverter?: TimeConverter;
  timePositionConverter: TimePositionConverter;
  positionConverter?: PositionConverter;
}): TimePositionConverter => {
  const convert = (val: Time): Position => {
    const timeConverter = params.timeConverter || timeNoOp();
    const positionConverter = params.positionConverter || positionNoOp();
    const convertedTime = timeConverter.convert(val);
    const position = params.timePositionConverter.convert(convertedTime);
    const convertedPosition = positionConverter.convert(position);
    return convertedPosition;
  };

  return { convert };
};

export const TimePipe = (converters: TimeConverter[]): TimeConverter => {
  const convert = (time: Time): Time =>
    converters.reduce((t, c) => c.convert(t), time);

  return { convert };
};

export const PositionPipe = (
  converters: PositionConverter[]
): PositionConverter => {
  const convert = (position: Position): Position =>
    converters.reduce((p, c) => c.convert(p), position);

  return { convert };
};
