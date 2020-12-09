import { Attempt } from 'luce-util';
import { p } from '../../../shapes';
import { parseM } from './parse-m';
import { ParsedCommand } from './parsed-command';

describe('parseM', () => {
  describe('for two numbers', () => {
    const values = [1, 2];

    it('returns single move command', () => {
      const result = parseM(true, values);
      expect(result.kind).toBe('success');

      const success = result.kind === 'success' ? result.value : undefined;
      expect(success?.length).toBe(1);
      expect(success?.[0].type).toBe('move');
      expect(success?.[0].position).toEqual(p(1, 2));
    });
  });

  describe('for six numbers', () => {
    const values = [1, 2, 3, 4, 5, 6];
    let result: Attempt<ParsedCommand[]>;
    let success: ParsedCommand[] | undefined;

    beforeEach(() => {
      result = parseM(true, values);
      success = result.kind === 'success' ? result.value : undefined;
    });

    it('is success', () => {
      expect(result.kind).toBe('success');
    });

    it('has correct number of commands', () => {
      expect(success?.length).toBe(3);
    });

    it('returns move command first', () => {
      expect(success?.[0].type).toBe('move');
      expect(success?.[0].position).toEqual(p(1, 2));
    });

    it('returns subsequent commands as line commands', () => {
      expect(success?.[1].type).toBe('line');
      expect(success?.[1].position).toEqual(p(3, 4));

      expect(success?.[2].type).toBe('line');
      expect(success?.[2].position).toEqual(p(5, 6));
    });
  });

  describe('for zero numbers', () => {
    it('returns failure', () => {
      expect(parseM(true, []).kind).toBe('failure');
    });
  });

  describe('for odd count of numbers', () => {
    it('returns failure', () => {
      expect(parseM(true, [1, 2, 3]).kind).toBe('failure');
    });
  });
});
