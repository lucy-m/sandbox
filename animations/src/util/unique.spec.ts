import { unique } from './unique';

describe('unique', () => {
  it('removes non-unique items', () => {
    const list = [0, 0, 1, 2, 4, 4, 5, 6, 6, 6];
    const expected = [0, 1, 2, 4, 5, 6];

    const actual = unique(list);

    expect(actual).toEqual(expected);
  });
});
