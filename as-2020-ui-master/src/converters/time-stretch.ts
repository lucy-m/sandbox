import { TimeConverter, Time } from './model';

/**
 * Scales the time by factor
 * @param factor
 */
export const TimeStretch = (factor: number): TimeConverter => {
  const convert = (val: Time): Time => {
    return { time: val.time / factor };
  };

  return { convert };
};
