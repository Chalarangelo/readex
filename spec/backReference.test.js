import { describe, it, expect } from 'vitest';
import { readEx } from '#src/readEx.js';
import { backReference } from '#src/backReference.js';

describe('backReference', () => {
  describe('when given a numbered reference', () => {
    it('should match the same pattern', () => {
      const regexp = readEx([/^/, /(a)/, backReference(1), /$/]);
      const [fullMatch, match] = regexp.exec('aa');
      expect(fullMatch).toBe('aa');
      expect(match).toBe('a');
    });
  });

  describe('when given a named reference', () => {
    it('should match the same pattern', () => {
      const regexp = readEx([
        /^/,
        /(?<myName>a)/,
        backReference('myName'),
        /$/,
      ]);
      const [fullMatch, match] = regexp.exec('aa');
      expect(fullMatch).toBe('aa');
      expect(match).toBe('a');
    });
  });
});
