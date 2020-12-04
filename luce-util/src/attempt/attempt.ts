export interface Success<T> {
  kind: 'success';
  value: T;
}

export interface Failure {
  kind: 'failure';
  messages: string[];
}

export type Attempt<T> = Success<T> | Failure;

export const makeSuccess = <T>(value: T): Attempt<T> => {
  return {
    kind: 'success',
    value,
  };
};

export const makeFailure = <T>(messages: string[]): Attempt<T> => {
  return {
    kind: 'failure',
    messages,
  };
};

export const isSuccess = <T>(attempt: Attempt<T>): attempt is Success<T> => {
  return attempt.kind === 'success';
};

export const isFailure = <T>(attempt: Attempt<T>): attempt is Failure => {
  return attempt.kind === 'failure';
};

export const getFailureMessages = <T>(attempt: Attempt<T>): string[] => {
  return isSuccess(attempt) ? [] : attempt.messages;
};

export const tryGetProp = <TObj, TProp>(
  t: TObj,
  selectorFn: (t: TObj) => TProp | undefined
): Attempt<TProp> => {
  const selector = selectorFn(t);

  if (selector !== undefined) {
    return makeSuccess(selector);
  } else {
    debugger;
    return makeFailure(['Could not get property for object ' + t]);
  }
};

export const tryFind = <T>(
  ts: T[],
  predicate: (t: T) => boolean
): Attempt<T> => {
  const t = ts.find(predicate);

  if (t !== undefined) {
    return makeSuccess(t);
  } else {
    return makeFailure(['Could not find value matching ' + predicate]);
  }
};
