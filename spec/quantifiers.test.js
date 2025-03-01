import { describe, it, expect } from 'vitest';
import './matchers.js';

import readEx from '#src/readEx.js';
import { maybe, oneOrMore } from '#src/quantifiers.js';

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

describe('oneOrMore', () => {
  it('should match the pattern once', () => {
    expect(readEx([/^/, oneOrMore('a'), /$/])).toMatchString('a');
  });

  it('should match the pattern multiple times', () => {
    expect(readEx([/^/, oneOrMore('a'), /$/])).toMatchString('aaa');
  });

  it('should not match the pattern if it is not present', () => {
    expect(readEx([/^/, oneOrMore('a'), /$/])).not.toMatchString('');
  });

  it('should be greedy by default', () => {
    const regexp = readEx(['b', oneOrMore(/./), 'b']);
    const [match] = regexp.exec('bab bcb');
    expect(match).toBe('bab bcb');
  });

  describe('with options', () => {
    it('should be lazy if lazy: true', () => {
      const regexp = readEx(['b', oneOrMore(/./, { lazy: true }), 'b']);
      const [match] = regexp.exec('bab bcb');
      expect(match).toBe('bab');
    });

    it('should be lazy if greedy: false', () => {
      const regexp = readEx(['b', oneOrMore(/./, { greedy: false }), 'b']);
      const [match] = regexp.exec('bab bcb');
      expect(match).toBe('bab');
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
