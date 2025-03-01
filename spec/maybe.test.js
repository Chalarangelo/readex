import { describe, it, expect } from 'vitest';
import './matchers.js';

import readEx from '#src/readEx.js';
import { maybe } from '#src/maybe.js';

describe('maybe', () => {
  it('should match the pattern if it is present', () => {
    expect(readEx([/^/, maybe('a'), /$/])).toMatchString('a');
  });

  it('should match the pattern if it is absent', () => {
    expect(readEx([/^/, maybe('a'), /$/])).toMatchString('');
  });

  it('should not match the pattern if it is not present', () => {
    expect(readEx([/^/, maybe('a'), /$/])).not.toMatchString('b');
  });

  it('should be greedy by default', () => {
    const regexp = readEx(['a', maybe(/./), 'a']);
    const [match] = regexp.exec('aaa');
    expect(match).toBe('aaa');
  });

  describe('with options', () => {
    it('should be lazy if lazy: true', () => {
      const regexp = readEx(['a', maybe(/./, { lazy: true }), 'a']);
      const [match] = regexp.exec('aaa');
      expect(match).toBe('aa');
    });

    it('should be lazy if greedy: false', () => {
      const regexp = readEx(['a', maybe(/./, { greedy: false }), 'a']);
      const [match] = regexp.exec('aaa');
      expect(match).toBe('aa');
    });

    it('should throw an error if given a non-boolean value', () => {
      expect(() => maybe('a', { lazy: 'true' })).toThrow();
    });

    it('should throw an error if given an invalid option', () => {
      expect(() => maybe('a', { invalid: true })).toThrow();
    });

    it('should throw an error if given multiple options', () => {
      expect(() => maybe('a', { lazy: true, greedy: false })).toThrow();
    });
  });
});
