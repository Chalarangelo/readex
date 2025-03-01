import { describe, it, expect } from 'vitest';
import './matchers.js';

import readEx from '#src/readEx.js';
import { lookahead, lookbehind } from '#src/lookAround.js';

describe('lookahead', () => {
  it('should ensure the pattern exists', () => {
    expect(readEx(['b', lookahead('a')])).toMatchString('ba');
  });

  it('should not match if the pattern is not present', () => {
    expect(readEx(['b', lookahead('a')])).not.toMatchString('b');
    expect(readEx(['b', lookahead('a')])).not.toMatchString('bc');
  });

  it('should not consume the pattern', () => {
    const regexp = readEx(['b', lookahead('a')]);
    const [match] = regexp.exec('ba');
    expect(match).toBe('b');
  });

  it('should work with multiple patterns', () => {
    expect(readEx(['b', lookahead('a', /./)])).toMatchString('bad');
  });

  describe('with negative: true', () => {
    it('should ensure the pattern does not exist', () => {
      expect(readEx(['b', lookahead('a', { negative: true })])).toMatchString(
        'b'
      );
    });

    it('should not match if the pattern is present', () => {
      expect(
        readEx(['b', lookahead('a', { negative: true })])
      ).not.toMatchString('ba');
      expect(
        readEx(['b', lookahead('a', { negative: true })])
      ).not.toMatchString('bad');
    });

    it('should not consume the pattern', () => {
      const regexp = readEx(['b', lookahead('a', { negative: true })]);
      const [match] = regexp.exec('b');
      expect(match).toBe('b');
    });

    it('should work with multiple patterns', () => {
      expect(
        readEx(['b', lookahead('a', /./, { negative: true })])
      ).toMatchString('b');
    });

    describe('with positive: true', () => {
      it('should throw an error', () => {
        expect(() =>
          lookahead('a', { negative: true, positive: true })
        ).toThrow();
      });
    });
  });
});

describe('lookbehind', () => {
  it('should ensure the pattern exists', () => {
    expect(readEx([lookbehind('a'), 'b'])).toMatchString('ab');
  });

  it('should not match if the pattern is not present', () => {
    expect(readEx([lookbehind('a'), 'b'])).not.toMatchString('b');
    expect(readEx([lookbehind('a'), 'b'])).not.toMatchString('cb');
  });

  it('should not consume the pattern', () => {
    const regexp = readEx([lookbehind('a'), 'b']);
    const [match] = regexp.exec('ab');
    expect(match).toBe('b');
  });

  it('should work with multiple patterns', () => {
    expect(readEx([lookbehind('a', /./), 'b'])).toMatchString('dab');
  });

  describe('with negative: true', () => {
    it('should ensure the pattern does not exist', () => {
      expect(readEx([lookbehind('a', { negative: true }), 'b'])).toMatchString(
        'b'
      );
      expect(readEx([lookbehind('a', { negative: true }), 'b'])).toMatchString(
        'cb'
      );
    });

    it('should not match if the pattern is present', () => {
      expect(
        readEx([lookbehind('a', { negative: true }), 'b'])
      ).not.toMatchString('ab');
    });

    it('should not consume the pattern', () => {
      const regexp = readEx([lookbehind('a', { negative: true }), 'b']);
      const [match] = regexp.exec('b');
      expect(match).toBe('b');
    });

    it('should work with multiple patterns', () => {
      expect(
        readEx([lookbehind('a', /./, { negative: true }), 'b'])
      ).toMatchString('bda');
    });

    describe('with positive: true', () => {
      it('should throw an error', () => {
        expect(() =>
          lookbehind('a', { negative: true, positive: true })
        ).toThrow();
      });
    });
  });
});
