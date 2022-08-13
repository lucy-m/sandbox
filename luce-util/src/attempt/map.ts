import { Attempt, isSuccess, makeSuccess } from './attempt';
import { bind5 } from './bind';

export const map5 = <T1, T2, T3, T4, T5, R>(
  t1: Attempt<T1>,
  t2: Attempt<T2>,
  t3: Attempt<T3>,
  t4: Attempt<T4>,
  t5: Attempt<T5>,
  selector: (v1: T1, v2: T2, v3: T3, v4: T4, v5: T5) => R
): Attempt<R> => {
  const bindSelector = (v1: T1, v2: T2, v3: T3, v4: T4, v5: T5) =>
    makeSuccess(selector(v1, v2, v3, v4, v5));

  return bind5(t1, t2, t3, t4, t5, bindSelector);
};

export const map4 = <T1, T2, T3, T4, R>(
  t1: Attempt<T1>,
  t2: Attempt<T2>,
  t3: Attempt<T3>,
  t4: Attempt<T4>,
  selector: (v1: T1, v2: T2, v3: T3, v4: T4) => R
): Attempt<R> => {
  const t5 = makeSuccess({});

  return map5(t1, t2, t3, t4, t5, selector);
};

export const map3 = <T1, T2, T3, R>(
  t1: Attempt<T1>,
  t2: Attempt<T2>,
  t3: Attempt<T3>,
  selector: (v1: T1, v2: T2, v3: T3) => R
): Attempt<R> => {
  const t4 = makeSuccess({});
  const t5 = makeSuccess({});

  return map5(t1, t2, t3, t4, t5, selector);
};

export const map2 = <T1, T2, R>(
  t1: Attempt<T1>,
  t2: Attempt<T2>,
  selector: (v1: T1, v2: T2) => R
): Attempt<R> => {
  const t3 = makeSuccess({});
  const t4 = makeSuccess({});
  const t5 = makeSuccess({});

  return map5(t1, t2, t3, t4, t5, selector);
};

export const map = <T, R>(t: Attempt<T>, selector: (v: T) => R): Attempt<R> => {
  if (isSuccess(t)) {
    return makeSuccess(selector(t.value));
  } else {
    return t;
  }
};
