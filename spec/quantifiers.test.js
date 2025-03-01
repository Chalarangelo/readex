import { describe, it, expect } from 'vitest';
import './matchers.js';

import readEx from '#src/readEx.js';
import { maybe, oneOrMore, zeroOrMore, repeat } from '#src/quantifiers.js';

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
      expect(() => oneOrMore('a', { lazy: 'true' })).toThrow();
    });

    it('should throw an error if given an invalid option', () => {
      expect(() => oneOrMore('a', { invalid: true })).toThrow();
    });

    it('should throw an error if given multiple options', () => {
      expect(() => oneOrMore('a', { lazy: true, greedy: false })).toThrow();
    });
  });
});

describe('zeroOrMore', () => {
  it('should match if the pattern is not present', () => {
    expect(readEx([/^/, zeroOrMore('a'), /$/])).toMatchString('');
  });

  it('should match the pattern once', () => {
    expect(readEx([/^/, zeroOrMore('a'), /$/])).toMatchString('a');
  });

  it('should match the pattern multiple times', () => {
    expect(readEx([/^/, zeroOrMore('a'), /$/])).toMatchString('aaa');
  });

  it('should be greedy by default', () => {
    const regexp = readEx(['b', zeroOrMore(/./), 'b']);
    const [match] = regexp.exec('bab bcb');
    expect(match).toBe('bab bcb');
  });

  describe('with options', () => {
    it('should be lazy if lazy: true', () => {
      const regexp = readEx(['b', zeroOrMore(/./, { lazy: true }), 'b']);
      const [match] = regexp.exec('bab bcb');
      expect(match).toBe('bab');
    });

    it('should be lazy if greedy: false', () => {
      const regexp = readEx(['b', zeroOrMore(/./, { greedy: false }), 'b']);
      const [match] = regexp.exec('bab bcb');
      expect(match).toBe('bab');
    });

    it('should throw an error if given a non-boolean value', () => {
      expect(() => zeroOrMore('a', { lazy: 'true' })).toThrow();
    });

    it('should throw an error if given an invalid option', () => {
      expect(() => zeroOrMore('a', { invalid: true })).toThrow();
    });

    it('should throw an error if given multiple options', () => {
      expect(() => zeroOrMore('a', { lazy: true, greedy: false })).toThrow();
    });
  });
});

describe('repeat', () => {
  describe('when given a number of times', () => {
    it('should match the pattern the specified number of times', () => {
      expect(readEx([/^/, repeat('a', { times: 3 }), /$/])).toMatchString(
        'aaa'
      );
    });

    it('should not match the pattern fewer times', () => {
      expect(readEx([/^/, repeat('a', { times: 3 }), /$/])).not.toMatchString(
        'aa'
      );
    });

    it('should not match the pattern more times', () => {
      expect(readEx([/^/, repeat('a', { times: 3 }), /$/])).not.toMatchString(
        'aaaa'
      );
    });

    it('should throw an error if given a non-integer value', () => {
      expect(() => repeat('a', { times: 3.5 })).toThrow();
    });

    it('should throw an error if min or max options are present', () => {
      expect(() => repeat('a', { times: 3, min: 1 })).toThrow();
      expect(() => repeat('a', { times: 3, max: 5 })).toThrow();
    });
  });

  describe('when only a min is given', () => {
    it('should match the pattern the minimum number of times', () => {
      expect(readEx([/^/, repeat('a', { min: 2 }), /$/])).toMatchString('aa');
    });

    it('should match the pattern more times', () => {
      expect(readEx([/^/, repeat('a', { min: 2 }), /$/])).toMatchString('aaa');
    });

    it('should not match the pattern fewer times', () => {
      expect(readEx([/^/, repeat('a', { min: 2 }), /$/])).not.toMatchString(
        'a'
      );
    });

    it('should throw an error if given a non-integer value', () => {
      expect(() => repeat('a', { min: 2.5 })).toThrow();
    });
  });

  describe('when only a max is given', () => {
    it('should match the pattern the maximum number of times', () => {
      expect(readEx([/^/, repeat('a', { max: 2 }), /$/])).toMatchString('a');
    });

    it('should match the pattern fewer times', () => {
      expect(readEx([/^/, repeat('a', { max: 2 }), /$/])).toMatchString('a');
    });

    it('should not match the pattern more times', () => {
      expect(readEx([/^/, repeat('a', { max: 2 }), /$/])).not.toMatchString(
        'aaa'
      );
    });

    it('should throw an error if given a non-integer value', () => {
      expect(() => repeat('a', { max: 2.5 })).toThrow();
    });
  });

  describe('when given both a min and a max', () => {
    it('should match the pattern the specified number of times', () => {
      expect(readEx([/^/, repeat('a', { min: 2, max: 3 }), /$/])).toMatchString(
        'aa'
      );
      expect(readEx([/^/, repeat('a', { min: 2, max: 3 }), /$/])).toMatchString(
        'aaa'
      );
    });

    it('should not match the pattern fewer times', () => {
      expect(
        readEx([/^/, repeat('a', { min: 2, max: 3 }), /$/])
      ).not.toMatchString('a');
    });

    it('should not match the pattern more times', () => {
      expect(
        readEx([/^/, repeat('a', { min: 2, max: 3 }), /$/])
      ).not.toMatchString('aasa');
    });

    it('should match the pattern exactly min times if min equals max', () => {
      expect(readEx([/^/, repeat('a', { min: 3, max: 3 }), /$/])).toMatchString(
        'aaa'
      );
    });

    it('should throw an error if min is greater than max', () => {
      expect(() => repeat('a', { min: 3, max: 2 })).toThrow();
    });
  });
});
