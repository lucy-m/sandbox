import { TimeConverter, Time } from './model';

export const Delay = (amount: number): TimeConverter => {
  const convert = (val: Time): Time => {
    return { time: val.time - amount };
  };

  return { convert };
};
