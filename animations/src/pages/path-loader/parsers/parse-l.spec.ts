import { Attempt } from 'luce-util';
import { p } from '../../../shapes';
import { parseL } from './parse-l';
import { ParsedCommand } from './parser';

describe('parseL', () => {
  describe('too few values', () => {
    it('returns failure', () => {
      expect(parseL(true, []).kind).toBe('failure');
      expect(parseL(true, [1]).kind).toBe('failure');
    });
  });

  describe('odd number of values', () => {
    it('returns failure', () => {
      expect(parseL(true, [1, 2, 3]).kind).toBe('failure');
      expect(parseL(true, [1, 2, 3, 4, 5]).kind).toBe('failure');
    });
  });

  describe('for a set of four points', () => {
    let values: number[];
    let result: Attempt<ParsedCommand[]>;
    let success: ParsedCommand[] | undefined;

    beforeEach(() => {
      values = [1, 2, 3, 4];
      result = parseL(true, values);
      success = result.kind === 'success' ? result.value : undefined;
    });

    it('is success', () => {
      expect(result.kind).toBe('success');
    });

    it('creates two parsed commands', () => {
      expect(success?.length).toBe(2);

      expect(success?.[0].type).toBe('line');
      expect(success?.[0].position).toEqual(p(1, 2));

      expect(success?.[1].type).toBe('line');
      expect(success?.[1].position).toEqual(p(3, 4));
    });
  });
});
