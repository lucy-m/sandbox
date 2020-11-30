import { innerZip, leftNearestZip, spacedFullZip } from './zip';

describe('spacedFullZip', () => {
  it('zips empty list correctly', () => {
    expect(spacedFullZip([], [])).toEqual([]);
  });

  it('zips first empty list correctly', () => {
    const nonEmpty = [1, 2, 3];

    const expected = nonEmpty.map((u) => [undefined, u]);
    const actual = spacedFullZip([], nonEmpty);

    expect(actual).toEqual(expected);
  });

  it('zips second empty list correctly', () => {
    const nonEmpty = [0, 1, 2, 3];

    const expected = nonEmpty.map((t) => [t, undefined]);
    const actual = spacedFullZip(nonEmpty, []);

    expect(actual).toEqual(expected);
  });

  it('zips same sized list correctly', () => {
    const list = [0, 1, 2];

    const expected = list.map((t) => [t, t]);
    const actual = spacedFullZip(list, list);

    expect(actual).toEqual(expected);
  });

  it('zips 4 and 8 list correctly', () => {
    const eightList = [0, 1, 2, 3, 4, 5, 6, 7];
    const fourList = [0, 1, 2, 3];

    const expected = [
      [0, 0],
      [1, undefined],
      [2, undefined],
      [3, 1],
      [4, undefined],
      [5, 2],
      [6, undefined],
      [7, 3],
    ];
    const actual = spacedFullZip(eightList, fourList);

    expect(actual).toEqual(expected);
  });

  it('zips 3 and 7 lists correctly', () => {
    const threeList = [0, 1, 2];
    const sevenList = [0, 1, 2, 3, 4, 5, 6];

    const expected = [
      [0, 0],
      [1, undefined],
      [2, undefined],
      [3, 1],
      [4, undefined],
      [5, undefined],
      [6, 2],
    ];
    const actual = spacedFullZip(sevenList, threeList);

    expect(actual).toEqual(expected);
  });
});

describe('innerZip', () => {
  it('zips empty lists', () => {
    expect(innerZip([], [])).toEqual([]);
  });

  it('zips single empty list', () => {
    const nonEmpty = [0, 1, 2];

    expect(innerZip([], nonEmpty)).toEqual([]);
    expect(innerZip(nonEmpty, [])).toEqual([]);
  });

  it('zips even length lists', () => {
    const numList = [0, 1, 2];
    const abcList = ['a', 'b', 'c'];

    const expected = [
      [0, 'a'],
      [1, 'b'],
      [2, 'c'],
    ];

    expect(innerZip(numList, abcList)).toEqual(expected);
  });

  it('zips uneven length lists', () => {
    const threeList = [0, 1, 2];
    const fiveList = ['a', 'b', 'c', 'd', 'e'];

    const expected = [
      [0, 'a'],
      [1, 'b'],
      [2, 'c'],
    ];

    expect(innerZip(threeList, fiveList)).toEqual(expected);
  });
});

describe('leftNearestZip', () => {
  it('matches uneven length number list correctly', () => {
    const a = [1, 2, 14, 29, 41];
    const b = [0, 10, 20, 30];

    const expected = [
      [1, 0],
      [2, 0],
      [14, 10],
      [29, 30],
      [41, 30],
    ];

    const actual = leftNearestZip(a, b, (t, u) => Math.abs(t - u));

    expect(actual).toEqual(expected);
  });
});
