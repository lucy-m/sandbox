import { Attempt, isSuccess } from './attempt';

export const valueOr = <T>(a: Attempt<T>, or: () => T): T => {
  if (isSuccess(a)) {
    return a.value;
  } else {
    return or();
  }
};
