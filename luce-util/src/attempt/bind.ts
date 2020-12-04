import {
  Attempt,
  Failure,
  getFailureMessages,
  isSuccess,
  makeFailure,
  makeSuccess,
  Success,
} from './attempt';

export const bind5 = <T1, T2, T3, T4, T5, R>(
  t1: Attempt<T1>,
  t2: Attempt<T2>,
  t3: Attempt<T3>,
  t4: Attempt<T4>,
  t5: Attempt<T5>,
  selector: (v1: T1, v2: T2, v3: T3, v4: T4, v5: T5) => Attempt<R>
): Attempt<R> => {
  if (
    isSuccess(t1) &&
    isSuccess(t2) &&
    isSuccess(t3) &&
    isSuccess(t4) &&
    isSuccess(t5)
  ) {
    return selector(t1.value, t2.value, t3.value, t4.value, t5.value);
  } else {
    const failures = [t1, t2, t3, t4, t5]
      .map((t) => t as Attempt<any>)
      .map(getFailureMessages)
      .reduce((a, b) => a.concat(b), []);
    return makeFailure(failures);
  }
};

export const bind4 = <T1, T2, T3, T4, R>(
  t1: Attempt<T1>,
  t2: Attempt<T2>,
  t3: Attempt<T3>,
  t4: Attempt<T4>,
  selector: (v1: T1, v2: T2, v3: T3, v4: T4) => Attempt<R>
) => {
  const t5 = makeSuccess({});

  return bind5(t1, t2, t3, t4, t5, selector);
};

export const bind3 = <T1, T2, T3, R>(
  t1: Attempt<T1>,
  t2: Attempt<T2>,
  t3: Attempt<T3>,
  selector: (v1: T1, v2: T2, v3: T3) => Attempt<R>
) => {
  const t4 = makeSuccess({});
  const t5 = makeSuccess({});

  return bind5(t1, t2, t3, t4, t5, selector);
};

export const bind2 = <T1, T2, R>(
  t1: Attempt<T1>,
  t2: Attempt<T2>,
  selector: (v1: T1, v2: T2) => Attempt<R>
) => {
  const t3 = makeSuccess({});
  const t4 = makeSuccess({});
  const t5 = makeSuccess({});

  return bind5(t1, t2, t3, t4, t5, selector);
};

export const bind = <T, R>(t: Attempt<T>, selector: (t: T) => Attempt<R>) => {
  if (isSuccess(t)) {
    return selector(t.value);
  } else {
    return t;
  }
};

export const bindMany = <T>(ts: Attempt<T>[]): Attempt<T[]> => {
  const successes: Success<T>[] = [];
  const failures: Failure[] = [];

  ts.forEach((t) => {
    if (isSuccess(t)) {
      successes.push(t);
    } else {
      failures.push(t);
    }
  });

  if (failures.length > 0) {
    const messages = failures
      .map((t) => t.messages)
      .reduce((a, b) => a.concat(b), []);
    return makeFailure(messages);
  } else {
    const values = successes.map((t) => t.value);
    return makeSuccess(values);
  }
};
