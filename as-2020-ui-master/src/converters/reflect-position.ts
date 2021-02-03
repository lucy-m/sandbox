import { PositionConverter, Position } from './model';

export const reflectX = (x?: number): PositionConverter => {
  const convert = (val: Position): Position => {
    x = x || 0;
    const newX = (val.position.x - x) * -1 + x;
    return { position: { x: newX, y: val.position.y } };
  };

  return { convert };
};

export const reflectY = (y?: number): PositionConverter => {
  const convert = (val: Position): Position => {
    y = y || 0;
    const newY = (val.position.y - y) * -1 + y;
    return { position: { x: val.position.x, y: newY } };
  };

  return { convert };
};
