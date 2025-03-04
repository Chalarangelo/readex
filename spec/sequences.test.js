import { describe, it, expect } from 'vitest';
import './matchers.js';

import readEx from '#src/readEx.js';
import {
  startOfLine,
  endOfLine,
  wordBoundary,
  nonWordBoundary,
  digit,
  nonDigit,
  wordCharacter,
  nonWordCharacter,
  whitespaceCharacter,
  nonWhitespaceCharacter,
  anyCharacter,
  anything,
  something,
} from '#src/sequences.js';

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

describe('digit', () => {
  it.each(Array.from({ length: 9 }, (_, i) => `${i}`))(
    'matches any digit (%s)',
    str => {
      expect(readEx([/^/, digit, /$/])).toMatchString(str);
    }
  );

  it.each(['a', '!', ' '])('does not match non-digit characters', str => {
    expect(readEx([/^/, digit, /$/])).not.toMatchString(str);
  });

  it('should not match more than one digit', () => {
    expect(readEx([/^/, digit, /$/])).not.toMatchString('12');
  });
});

describe('nonDigit', () => {
  it.each(['a', '!', ' '])('matches any non-digit (%s)', str => {
    expect(readEx([/^/, nonDigit, /$/])).toMatchString(str);
  });

  it.each(Array.from({ length: 9 }, (_, i) => `${i}`))(
    'does not match digit characters',
    str => {
      expect(readEx([/^/, nonDigit, /$/])).not.toMatchString(str);
    }
  );

  it('should not match more than one non-digit', () => {
    expect(readEx([/^/, nonDigit, /$/])).not.toMatchString('ab');
  });
});

describe('wordCharacter', () => {
  it.each(['a', 'A', '0', '_'])('matches any word character (%s)', str => {
    expect(readEx([/^/, wordCharacter, /$/])).toMatchString(str);
  });

  it.each(['!', ' ', '-'])('does not match non-word characters', str => {
    expect(readEx([/^/, wordCharacter, /$/])).not.toMatchString(str);
  });

  it('should not match more than one word character', () => {
    expect(readEx([/^/, wordCharacter, /$/])).not.toMatchString('ab');
  });
});

describe('nonWordCharacter', () => {
  it.each(['!', ' ', '-'])('matches any non-word character (%s)', str => {
    expect(readEx([/^/, nonWordCharacter, /$/])).toMatchString(str);
  });

  it.each(['a', 'A', '0', '_'])('does not match word characters', str => {
    expect(readEx([/^/, nonWordCharacter, /$/])).not.toMatchString(str);
  });

  it('should not match more than one non-word character', () => {
    expect(readEx([/^/, nonWordCharacter, /$/])).not.toMatchString('ab');
  });
});

describe('whitespaceCharacter', () => {
  it.each([' ', '\t', '\n', '\r'])(
    'matches any whitespace character (%s)',
    str => {
      expect(readEx([/^/, whitespaceCharacter, /$/])).toMatchString(str);
    }
  );

  it.each(['a', 'A', '0', '_', '-'])(
    'does not match non-whitespace characters',
    str => {
      expect(readEx([/^/, whitespaceCharacter, /$/])).not.toMatchString(str);
    }
  );

  it('should not match more than one whitespace character', () => {
    expect(readEx([/^/, whitespaceCharacter, /$/])).not.toMatchString('ab');
  });
});

describe('nonWhitespaceCharacter', () => {
  it.each(['a', 'A', '0', '_', '-'])(
    'matches any non-whitespace character (%s)',
    str => {
      expect(readEx([/^/, nonWhitespaceCharacter, /$/])).toMatchString(str);
    }
  );

  it.each([' ', '\t', '\n', '\r'])(
    'does not match whitespace characters',
    str => {
      expect(readEx([/^/, nonWhitespaceCharacter, /$/])).not.toMatchString(str);
    }
  );

  it('should not match more than one non-whitespace character', () => {
    expect(readEx([/^/, nonWhitespaceCharacter, /$/])).not.toMatchString('ab');
  });
});
describe('anyCharacter', () => {
  it.each(['a', '1', '.', '!', 'α'])(
    'should match any character (%s)',
    character => {
      expect(readEx([/^/, anyCharacter, /$/])).toMatchString(character);
    }
  );

  it.each(['\n', '\r', '\u2028', '\u2029'])(
    'should not match line terminators',
    character => {
      expect(readEx([/^/, anyCharacter, /$/])).not.toMatchString(character);
    }
  );

  it('should not match empty string', () => {
    expect(readEx([/^/, anyCharacter, /$/])).not.toMatchString('');
  });

  it('should not match more than one character', () => {
    expect(readEx([/^/, anyCharacter, /$/])).not.toMatchString('ab');
  });
});

describe('anything', () => {
  it.each(['a', '1', '.', '!', 'α', '\n', '\r', '\u2028', '\u2029'])(
    'should match any single character or line terminator',
    character => {
      expect(readEx([/^/, anything, /$/])).toMatchString(character);
    }
  );

  it('should match empty string', () => {
    expect(readEx([/^/, anything, /$/])).toMatchString('');
  });

  it.each(['ab', 'a\n', '\na', 'abc \n.α!', '\n a', '\n\n'])(
    'should match multiple characters and/or line terminators',
    string => {
      expect(readEx([/^/, anything, /$/])).toMatchString(string);
    }
  );
});

describe('something', () => {
  it.each(['a', '1', '.', '!', 'α'])(
    'should match any single character (%s)',
    character => {
      expect(readEx([/^/, something, /$/])).toMatchString(character);
    }
  );

  it.each(['\n', '\r', '\u2028', '\u2029', '\n\n'])(
    'should not match single or multiple line terminators',
    character => {
      expect(readEx([/^/, anyCharacter, /$/])).not.toMatchString(character);
    }
  );

  it('should not match empty string', () => {
    expect(readEx([/^/, something, /$/])).not.toMatchString('');
  });

  it.each(['ab', 'a\n', '\na', 'abc \n.α!', '\n a'])(
    'should match multiple characters and line terminators',
    string => {
      expect(readEx([/^/, something, /$/])).toMatchString(string);
    }
  );
});
