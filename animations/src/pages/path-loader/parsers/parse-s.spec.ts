import { Attempt } from 'luce-util';
import { p } from '../../../shapes';
import { parseS } from './parse-s';
import { ParsedCommand, SmoothCommand } from './parsed-command';

describe('parseS', () => {
  describe('too few values', () => {
    it('returns failure', () => {
      expect(parseS(true, []).kind).toBe('failure');
      expect(parseS(true, [1]).kind).toBe('failure');
      expect(parseS(true, [1, 2]).kind).toBe('failure');
      expect(parseS(true, [1, 2, 3]).kind).toBe('failure');
    });
  });

  describe('non-multiple-of-4 values', () => {
    it('returns failure', () => {
      expect(parseS(true, [1, 2, 3, 4, 5]).kind).toBe('failure');
      expect(parseS(true, [1, 2, 3, 4, 5, 6]).kind).toBe('failure');
      expect(parseS(true, [1, 2, 3, 4, 5, 6, 7]).kind).toBe('failure');
    });
  });

  describe('for set of 8 points', () => {
    let values: number[];
    let result: Attempt<ParsedCommand[]>;
    let success: ParsedCommand[] | undefined;

    beforeEach(() => {
      values = [1, 2, 3, 4, 5, 6, 7, 8];
      result = parseS(true, values);
      success = result.kind === 'success' ? result.value : undefined;
    });

    it('is success', () => {
      expect(result.kind).toBe('success');
    });

    it('creates two parsed commands', () => {
      expect(success?.length).toBe(2);

      expect(success?.[0].type).toBe('smooth');
      expect(success?.[0].position).toEqual(p(3, 4));
      expect((success?.[0] as SmoothCommand).control).toEqual(p(1, 2));

      expect(success?.[1].type).toBe('smooth');
      expect(success?.[1].position).toEqual(p(7, 8));
      expect((success?.[1] as SmoothCommand).control).toEqual(p(5, 6));
    });
  });
});
