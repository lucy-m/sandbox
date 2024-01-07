/**
 * Applies `project` to each element in `ts` and filters out
 *   `undefined` values.
 */
export const choose = <T, U>(
  ts: readonly T[],
  project: (t: T) => U | undefined
): U[] =>
  ts.reduce((acc, t) => {
    const value = project(t);

    if (value === undefined) {
      return acc;
    } else {
      return [...acc, value];
    }
  }, [] as U[]);

export const filterUndefined = <T>(ts: readonly (T | undefined)[]): T[] => {
  return choose(ts, (v) => v);
};
