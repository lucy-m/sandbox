/**
 * Zips two lists together. All items from the list will be included.
 * For list length >= 2, the first and last items will have values.
 * Any empty values will be distributed evenly along the list.
 * @param ts
 * @param us
 */
export const spacedFullZip = <T, U>(
  ts: T[],
  us: U[]
): [T | undefined, U | undefined][] => {
  if (ts.length === 0) {
    return us.map((u) => [undefined, u]);
  } else if (us.length === 0) {
    return ts.map((t) => [t, undefined]);
  }

  const length = Math.max(ts.length, us.length);
  const base = length - 1;
  const initial = [{ t: ts[0], u: us[0] }];
  const tBase = ts.length - 1;
  const uBase = us.length - 1;

  interface Acc {
    list: { t?: T; u?: U }[];
    lastIndex: { t: number; u: number };
    i: number;
  }

  const result = Array.from({ length: base }).reduce<Acc>(
    (acc) => {
      const tIndex = Math.trunc((tBase * acc.i) / base);
      const tVal = tIndex > acc.lastIndex.t ? ts[tIndex] : undefined;

      const uIndex = Math.trunc((uBase * acc.i) / base);
      const uVal = uIndex > acc.lastIndex.u ? us[uIndex] : undefined;

      const lastIndex = { t: tIndex, u: uIndex };
      const list = acc.list.concat({ t: tVal, u: uVal });

      return { lastIndex, list, i: acc.i + 1 };
    },
    {
      list: initial,
      lastIndex: { t: 0, u: 0 },
      i: 1,
    }
  );

  return result.list.map(({ t, u }) => [t, u]);
};

/**
 * Zips two lists together. The longer list will be truncated.
 * @param ts
 * @param us
 */
export const innerZip = <T, U>(ts: T[], us: U[]): [T, U][] => {
  const length = Math.min(ts.length, us.length);

  return Array.from({ length }).map((_, i) => {
    const t = ts[i];
    const u = us[i];

    return [t, u];
  });
};

/**
 * Matches all of the left items up to the nearest right element
 * using the given distance fn
 * Items from second list may be duplicated
 * @param ts
 * @param us
 */
export const leftNearestZip = <T, U>(
  ts: T[],
  us: U[],
  dist: (t: T, u: U) => number
): [T, U][] => {
  const match = (t: T): U =>
    us
      .map((u) => ({ u, dist: dist(t, u) }))
      .reduce((a, b) => (a.dist < b.dist ? a : b)).u;

  return ts.map((t) => [t, match(t)]);
};
