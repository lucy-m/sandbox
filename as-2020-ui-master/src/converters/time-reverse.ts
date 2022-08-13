import { TimeConverter, Time } from './model';

export const TimeReverse = (after: number): TimeConverter => {
  const convert = (val: Time): Time => {
    if (val.time < after) {
      return val;
    } else {
      return { time: 2 * after - val.time };
    }
  };

  return { convert };
};
