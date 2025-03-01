import { describe, it, expect } from 'vitest';
import readEx from '#src/readEx.js';
import { group } from '#src/group.js';

describe('group', () => {
  describe.each([
    ['with default options', {}],
    ['with capture: true', { capture: true }],
  ])('%s', (_, options) => {
    it('should create a capturing group', () => {
      const regexp = readEx([/^/, 'a', group('bc', options), /$/]);
      const [fullMatch, match] = regexp.exec('abc');
      expect(fullMatch).toBe('abc');
      expect(match).toBe('bc');
    });

    it('should work with multiple groups', () => {
      const regexp = readEx([
        /^/,
        group('a', options),
        group('b', options),
        group('c', options),
        /$/,
      ]);
      const [, a, b, c] = regexp.exec('abc');
      expect(a).toBe('a');
      expect(b).toBe('b');
      expect(c).toBe('c');
    });
  });

  describe('with capture: false', () => {
    it('should create a non-capturing group', () => {
      const regexp = readEx([/^/, 'a', group(/bc/, { capture: false }), /$/]);
      const [fullMatch, match] = regexp.exec('abc');
      expect(fullMatch).toBe('abc');
      expect(match).not.toBe('bc');
    });
  });

  describe('when given a name', () => {
    it('should create a named capturing group', () => {
      const regexp = readEx([/^/, 'a', group('bc', { name: 'myName' }), /$/]);
      const matches = regexp.exec('abc');
      expect(matches[0]).toBe('abc');
      expect(matches.groups.myName).toBe('bc');
    });

    describe('when given an invalid name', () => {
      it('should throw an error', () => {
        expect(() => group('bc', { name: 123 })).toThrow();
      });
    });

    describe('when given capture: false', () => {
      it('should throw an error', () => {
        expect(() => group('bc', { name: 'myName', capture: false })).toThrow();
      });
    });
  });

  describe('with a single expression and no options argument', () => {
    it('should create a capturing group', () => {
      const regexp = readEx([/^/, 'a', group('bc'), /$/]);
      const [fullMatch, match] = regexp.exec('abc');
      expect(fullMatch).toBe('abc');
      expect(match).toBe('bc');
    });
  });

  describe('with an array of expressions', () => {
    it('should create a group with multiple expressions', () => {
      const regexp = readEx([/^/, group('a', /b/, 'c'), /$/]);
      const [fullMatch, match] = regexp.exec('abc');
      expect(fullMatch).toBe('abc');
      expect(match).toBe('abc');
    });
  });

  describe('with nested groups of different types', () => {
    it('should respect group options', () => {
      const regexp = readEx([
        /^/,
        group(
          'a',
          group('b', { capture: false }),
          'c',
          group('d', { name: 'myName' })
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
