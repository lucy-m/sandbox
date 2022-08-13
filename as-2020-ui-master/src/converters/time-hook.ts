import { TimeConverter, Time } from './model';

export const TimeHook = (at: number, hook: () => void): TimeConverter => {
  let hookCalled = false;
  const convert = (val: Time): Time => {
    if (val.time >= at && !hookCalled) {
      hook();
      hookCalled = true;
    }
    return val;
  };

  return { convert };
};
