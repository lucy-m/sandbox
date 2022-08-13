import {
  TimeConverter,
  Time,
  PositionConverter,
  Position,
  TimePositionConverter
} from './model';

export const timeNoOp = (): TimeConverter => {
  const convert = (time: Time): Time => time;

  return { convert };
};

export const positionNoOp = (): PositionConverter => {
  const convert = (position: Position): Position => position;

  return { convert };
};

export const constantTimePosition = (
  position: Position
): TimePositionConverter => {
  const convert = () => position;

  return { convert };
};
