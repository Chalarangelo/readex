import { describe, it, expect } from 'vitest';
import './matchers.js';

import { readEx } from '#src/readEx.js';
import {
  captureGroup,
  nonCaptureGroup,
  namedGroup,
  concat,
  or,
} from '#src/group.js';

describe('captureGroup', () => {
  describe('with a simple expression', () => {
    it('should create a capturing group', () => {
      const regexp = readEx([/^/, 'a', captureGroup('bc'), /$/]);
      const [fullMatch, match] = regexp.exec('abc');
      expect(fullMatch).toBe('abc');
      expect(match).toBe('bc');
    });
  });

  describe('with an array of expressions', () => {
    it('should create a capturing group with multiple expressions', () => {
      const regexp = readEx([/^/, captureGroup('a', /b/, 'c'), /$/]);
      const [fullMatch, match] = regexp.exec('abc');
      expect(fullMatch).toBe('abc');
      expect(match).toBe('abc');
    });
  });

  describe('with multiple groups', () => {
    it('should create multiple capturing groups', () => {
      const regexp = readEx([
        /^/,
        captureGroup('a'),
        captureGroup('b'),
        captureGroup('c'),
        /$/,
      ]);
      const [, a, b, c] = regexp.exec('abc');
      expect(a).toBe('a');
      expect(b).toBe('b');
      expect(c).toBe('c');
    });
  });
});

describe('nonCaptureGroup', () => {
  describe('with a simple expression', () => {
    it('should create a non-capturing group', () => {
      const regexp = readEx([/^/, 'a', nonCaptureGroup(/bc/), /$/]);
      const [fullMatch, match] = regexp.exec('abc');
      expect(fullMatch).toBe('abc');
      expect(match).not.toBe('bc');
    });
  });

  describe('with an array of expressions', () => {
    it('should create a non-capturing group with multiple expressions', () => {
      const regexp = readEx([/^/, nonCaptureGroup('a', /b/, 'c'), /$/]);
      const [fullMatch, match] = regexp.exec('abc');
      expect(fullMatch).toBe('abc');
      expect(match).not.toBe('abc');
    });
  });

  describe('with multiple groups', () => {
    it('should create multiple non-capturing groups', () => {
      const regexp = readEx([
        /^/,
        nonCaptureGroup('a'),
        nonCaptureGroup('b'),
        nonCaptureGroup('c'),
        /$/,
      ]);
      const [, a, b, c] = regexp.exec('abc');
      expect(a).not.toBe('a');
      expect(b).not.toBe('b');
      expect(c).not.toBe('c');
    });
  });
});

describe('namedGroup', () => {
  describe('with a simple expression', () => {
    it('should create a named capturing group', () => {
      const regexp = readEx([
        /^/,
        'a',
        namedGroup({ name: 'myName' }, 'bc'),
        /$/,
      ]);
      const matches = regexp.exec('abc');
      expect(matches[0]).toBe('abc');
      expect(matches.groups.myName).toBe('bc');
    });
  });

  describe('when not given a name', () => {
    it('should throw an error', () => {
      expect(() => namedGroup('bc')).toThrow();
      expect(() => namedGroup('a', 'bc')).toThrow();
    });
  });

  describe('when given an invalid name', () => {
    it('should throw an error', () => {
      expect(() => namedGroup({ name: 123 }, 'bc')).toThrow();
    });
  });

  describe('when nested groups of different types', () => {
    it('should respect group options', () => {
      const regexp = readEx([
        /^/,
        captureGroup(
          'a',
          nonCaptureGroup('b'),
          'c',
          namedGroup({ name: 'myName' }, 'd')
        ),
        /$/,
      ]);
      const matches = regexp.exec('abcd');
      expect(matches[0]).toBe('abcd');
      expect(matches[1]).toBe('abcd');
      expect(matches[2]).not.toBe('b');
      expect(matches.groups.myName).toBe('d');
    });
  });
});

describe('concat', () => {
  it.each([
    ['with strings', ['a', 'b', 'c']],
    ['with regexps', [/a/, /b/, /c/]],
    ['with a mix of strings and regexps', ['a', /b/, 'c']],
  ])('should combine expressions %s', (_, expressions) => {
    expect(readEx([/^/, concat(...expressions), /$/])).toMatchString('abc');
    expect(readEx([/^/, concat(...expressions), /$/])).not.toMatchString('a');
    expect(readEx([/^/, concat(...expressions), /$/])).not.toMatchString('ab');
  });
});

describe('or', () => {
  it('should match either of the patterns', () => {
    expect(readEx([/^/, or('a', 'b'), /$/])).toMatchString('a');
    expect(readEx([/^/, or('a', 'b'), /$/])).toMatchString('b');
  });

  it('should not match other patterns', () => {
    expect(readEx([/^/, or('a', 'b'), /$/])).not.toMatchString('c');
  });

  it('should match an individual option, not both', () => {
    expect(readEx([/^/, or('a', 'b'), /$/])).not.toMatchString('ab');
  });

  it('should work with a single pattern', () => {
    expect(readEx([/^/, or('a'), /$/])).toMatchString('a');
  });
});
