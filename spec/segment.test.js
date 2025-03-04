import { describe, it, expect } from 'vitest';
import { toSegment, toSegments, joinSegments } from '#src/segment.js';

describe('toSegment', () => {
  describe('when value is a RegExp segment', () => {
    it('copies the segment value', () => {
      const segment = toSegment('some value');
      expect(toSegment(segment).source).toEqual('some value');
    });
  });

  describe('when value is a RegExp instance', () => {
    describe.each([
      ['no special characters', /some value/, 'some value'],
      ['flags', /some value/gi, 'some value'],
      ['special characters', /some value./, 'some value.'],
    ])('and the RegExp contains %s', (_, expression, expected) => {
      it('copies the RegExp source', () => {
        expect(toSegment(expression).source).toEqual(expected);
      });
    });
  });

  describe('when value is ', () => {
    describe.each([
      ['a string', 'some value', 'some value'],
      ['a number', 123, '123'],
    ])('%s', (_, expression, expected) => {
      it('sanitizes the expression', () => {
        expect(toSegment(expression).source).toEqual(expected);
      });
    });
  });
});

describe('toSegments', () => {
  describe.each([
    ['a single string', ['some value'], ['some value']],
    ['a single number', [123], ['123']],
    ['a single RegExp', [/some value/], ['some value']],
    ['a single RegExp with flags', [/some value/gi], ['some value']],
    [
      'a single RegExp with special characters',
      [/some value./],
      ['some value.'],
    ],
    ['multiple strings', ['a', 'b'], ['a', 'b']],
    ['a string and a number', ['a', 123], ['a', '123']],
    ['a string and a RegExp', ['a', /b/], ['a', 'b']],
    ['a string and a RegExp with flags', ['a', /b/gim], ['a', 'b']],
    ['multiple RegExps', [/a/, /b/], ['a', 'b']],
  ])('when called with %s', (_, expressions, expected) => {
    it('returns an array of RegExp segments', () => {
      expect(toSegments(...expressions).map(seg => seg.source)).toEqual(
        expected
      );
    });
  });
});

describe('joinSegments', () => {
  describe.each([
    ['a single string', ['some value'], ['some value']],
    ['multiple strings', ['a', 'b'], ['a', 'b']],
    ['a string and a number', ['a', 123], ['a', '123']],
    ['a string and a RegExp', ['a', /b/], ['a', 'b']],
    ['a string and a RegExp with flags', ['a', /b/gim], ['a', 'b']],
    ['multiple RegExps', [/a/, /b/], ['a', 'b']],
    ['a string, a RegExp, and a number', ['a', /b/, 123], ['a', 'b', '123']],
  ])('when called with %s', (_, expressions, expected) => {
    it.each(['', '-', '|'])('and a "%s" separator', separator => {
      expect(
        joinSegments(toSegments(...expressions), separator).source
      ).toEqual(expected.join(separator));
    });
  });
});
