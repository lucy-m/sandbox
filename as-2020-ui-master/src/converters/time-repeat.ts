import { TimeConverter, Time } from './model';

export const TimeRepeat = (start: number, end: number): TimeConverter => {
  if (end <= start) {
    throw Error('For TimeRepeat pipe, end must be after start');
  }

  const convert = (val: Time): Time => {
    const intervalSize = end - start;
    if (val.time < start) {
      return val;
    }
    const newTime = ((val.time - start) % intervalSize) + start;

    return { time: newTime };
  };

  return { convert };
};
