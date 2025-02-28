import { describe, it, expect } from 'vitest';
import './matchers.js';

import readEx from '#src/readEx.js';
import {
  startOfLine,
  endOfLine,
  wordBoundary,
  nonWordBoundary,
} from '#src/anchors.js';

describe('startOfLine', () => {
  it.each(['ab', 'b\na'])('should match the start of a line', str => {
    expect(readEx([startOfLine, 'a'])).toMatchString(str);
  });

  it.each(['ba', '\nbna'])(
    'should not match if not at the start of a line',
    str => {
      expect(readEx([startOfLine, 'a'])).not.toMatchString(str);
    }
  );

  it('should not match anything if not the first segment', () => {
    expect(readEx(['a', startOfLine])).not.toMatchString('a');
  });

  describe('in non-multi-line mode', () => {
    it.each(['ab', 'a\nb'])('should match the start of a string', str => {
      expect(readEx([startOfLine, 'a'])).toMatchString(str, {
        multiline: false,
      });
    });

    it.each(['ba', 'b\na'])(
      'should not match if not at the start of a string',
      str => {
        expect(
          readEx([startOfLine, 'a'], {
            multiline: false,
          })
        ).not.toMatchString(str);
      }
    );
  });
});

describe('endOfLine', () => {
  it.each(['ba', 'b\na'])('should match the end of a line', str => {
    expect(readEx(['a', endOfLine])).toMatchString(str);
  });

  it.each(['ab', 'ab\nab'])(
    'should not match if not at the end of a line',
    str => {
      expect(readEx(['a', endOfLine])).not.toMatchString(str);
    }
  );

  it('should not match anything if not the last segment', () => {
    expect(readEx([endOfLine, 'a'])).not.toMatchString('a');
  });

  describe('in non-multi-line mode', () => {
    it.each(['ba', 'b\na'])('should match the end of a string', str => {
      expect(readEx(['a', endOfLine])).toMatchString(str, {
        multiline: false,
      });
    });

    it.each(['ab', 'a\nb'])(
      'should not match if not at the end of a string',
      str => {
        expect(
          readEx(['a', endOfLine], { multiline: false })
        ).not.toMatchString(str);
      }
    );
  });
});

describe('wordBoundary', () => {
  it.each(['b a b', 'b\na\nb', 'b a-b?', '.a.b', 'b-a-b', 'a'])(
    'should match word boundaries',
    str => {
      expect(readEx([wordBoundary, 'a', wordBoundary])).toMatchString(str);
    }
  );

  it.each(['bab', 'b_a_b', 'b a_ b', 'ba', 'ab', 'b'])(
    'should not match if not at a word boundary',
    str => {
      expect(readEx([wordBoundary, 'a', wordBoundary])).not.toMatchString(str);
    }
  );
});

describe('nonWordBoundary', () => {
  it.each(['bab', 'b_a_b', 'ba1'])(
    'should match if not at a word boundary',
    str => {
      expect(readEx([nonWordBoundary, 'a', nonWordBoundary])).toMatchString(
        str
      );
    }
  );

  it.each(['b a b', 'b\na\nb', 'b a-b?', '.a.b', 'b-a-b', 'a'])(
    'should not match word boundaries',
    str => {
      expect(readEx([nonWordBoundary, 'a', nonWordBoundary])).not.toMatchString(
        str
      );
    }
  );
});
