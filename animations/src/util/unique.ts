/**
 * Returns only unique items from the list
 * @param ts
 */
export const unique = <T>(ts: T[]): T[] => {
  return ts.reduce<T[]>(
    (acc, t) => (acc.indexOf(t) >= 0 ? acc : [...acc, t]),
    []
  );
};
