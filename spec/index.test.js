import { describe, it, expect } from 'vitest';
import './matchers.js';

import {
  anyCharacter,
  anything,
  backReference,
  captureGroup,
  concat,
  digit,
  endOfLine,
  lookahead,
  lookbehind,
  namedGroup,
  negativeLookahead,
  negativeLookbehind,
  nonCaptureGroup,
  nonDigit,
  nonWhitespaceCharacter,
  nonWordBoundary,
  nonWordCharacter,
  oneOrMore,
  oneOrMoreLazy,
  or,
  readEx,
  repeat,
  repeatLazy,
  something,
  startOfLine,
  whitespaceCharacter,
  wordBoundary,
  wordCharacter,
  zeroOrMore,
  zeroOrMoreLazy,
  zeroOrOne,
  zeroOrOneLazy,
  anythingFrom,
  anythingBut,
} from '#src/index.js';

describe('Integration tests', () => {
  const leadingZeroes = zeroOrMore(0);
  const octet = concat(
    leadingZeroes,
    or(
      // 0-199
      concat(zeroOrOne(anythingFrom([0, 1])), repeat({ times: [1, 2] }, digit)),
      // 200-249
      concat(2, anythingFrom([0, 4]), digit),
      // 250-255
      concat(25, anythingFrom([0, 5]))
    )
  );

  describe('RGB hex color codes', () => {
    const hexCharacter = anythingFrom(['0', '9'], ['a', 'f']);

    const segments = [
      startOfLine,
      '#',
      or(
        repeat({ times: 6 }, hexCharacter),
        repeat({ times: 3 }, hexCharacter)
      ),
      endOfLine,
    ];

    it.each(['#fbecda', '#127321', '#f1ab86', '#54FC98'])(
      'matches 6-digit hex codes (%s)',
      code => {
        expect(readEx(segments, { ignoreCase: true })).toMatchString(code);
      }
    );

    it.each(['#fff', '#000', '#ab1', '#8CD'])(
      'matches 3-digit hex codes (%s)',
      code => {
        expect(readEx(segments, { ignoreCase: true })).toMatchString(code);
      }
    );

    it.each(['#12345', '#1234567', 'ab12cd', '#ab_cd1', '#'])(
      'does not match invalid codes (%s)',
      code => {
        expect(readEx(segments, { ignoreCase: true })).not.toMatchString(code);
      }
    );
  });

  describe('RGB color codes', () => {
    const whitespace = zeroOrMore(whitespaceCharacter);
    const threeOctets = concat(
      octet,
      whitespace,
      ',',
      whitespace,
      octet,
      whitespace,
      ',',
      whitespace,
      octet
    );

    const trailingZeroes = zeroOrOne(concat('.', oneOrMore(0)));
    const decimalPart = zeroOrOne(concat('.', oneOrMore(digit)));
    const zeroToHundred = or(
      concat(leadingZeroes, 100, trailingZeroes),
      concat(leadingZeroes, repeat({ times: [1, 2] }, digit), decimalPart)
    );

    const percentage = concat(zeroToHundred, '%');
    const threePercentages = concat(
      percentage,
      whitespace,
      ',',
      whitespace,
      percentage,
      whitespace,
      ',',
      whitespace,
      percentage
    );

    const segments = [
      startOfLine,
      'rgb(',
      whitespace,
      or(threeOctets, threePercentages),
      whitespace,
      ')',
      endOfLine,
    ];

    it.each([
      'rgb(0,0,0)',
      'RGB(123, 200, 45)',
      'rgb( 3, 255, 15)',
      'Rgb(0123,   01  , 022 )',
    ])('matches three octets separated by commas (%s)', code => {
      expect(readEx(segments, { ignoreCase: true })).toMatchString(code);
    });

    it.each([
      'rgb(0%,50%,100%)',
      'RGB(1%, 1.5%, 45.9%)',
      'rgb( 50.245231232%, 10.0%, 99%)',
      'Rgb(012.30001%,   0001.1%  , 022.10% )',
    ])('matches three octets separated by commas (%s)', code => {
      expect(readEx(segments, { ignoreCase: true })).toMatchString(code);
    });

    it.each([
      'rgb (1,2,3)',
      'rgb(1,0)',
      'rgb(256, 0, 0)',
      'rgb(100.1, 0, 1)',
      'rgb(120%, 15%, 1%)',
      'rgb(255, 10%, 0)',
    ])('does not match invalid values (%s)', code => {
      expect(readEx(segments, { ignoreCase: true })).not.toMatchString(code);
    });
  });

  describe('IP addresses', () => {
    const segments = [
      startOfLine,
      octet,
      '.',
      octet,
      '.',
      octet,
      '.',
      octet,
      endOfLine,
    ];

    it.each([
      '192.168.1.1',
      '255.255.0.0',
      '1.2.3.4',
      '172.16.254.1',
      '127.0.0.1',
    ])('matches valid IP addresses (%s)', ip => {
      expect(readEx(segments)).toMatchString(ip);
    });

    it.each(['192.168.1.256', '1234.12.3.4', '888.888.888.888'])(
      'does not match invalid IP addresses (%s)',
      ip => {
        expect(readEx(segments)).not.toMatchString(ip);
      }
    );
  });

  describe('24-hour time', () => {
    const hour = or(
      // 00-19
      concat(zeroOrOne(anythingFrom([0, 1])), digit),
      // 20-23
      concat(2, anythingFrom([0, 3]))
    );

    const zeroToFiftyNine = concat(anythingFrom([0, 5]), digit);

    const segments = [
      startOfLine,
      hour,
      ':',
      zeroToFiftyNine,
      zeroOrOne(concat(':', zeroToFiftyNine)),
      endOfLine,
    ];

    it.each(['00:00', '23:59', '12:34', '9:08', '06:50', '20:00', '12:45:36'])(
      'matches valid 24-hour times (%s)',
      time => {
        expect(readEx(segments)).toMatchString(time);
      }
    );

    it.each([
      '24:00',
      '12:60',
      '12:345',
      '12:3',
      '12:34:',
      '1:55:26:1',
      '12:1',
    ])('does not match invalid times (%s)', time => {
      expect(readEx(segments)).not.toMatchString(time);
    });
  });

  describe('URLs', () => {
    const protocol = or('http', 'https', 'ftp');
    const www = zeroOrOne('www.');
    const domain = zeroOrMore(anythingBut(' '));

    const segments = [startOfLine, protocol, '://', www, domain, endOfLine];

    it.each([
      'http://example.com',
      'https://www.example.com',
      'ftp://example.com',
      'http://www.example.com',
      'http://example.com/path',
      'https://www.example.com/path',
      'ftp://example.com/path',
      'http://www.example.com/path',
    ])('matches valid URLs (%s)', url => {
      expect(readEx(segments)).toMatchString(url);
    });

    it.each([
      'http://example.com/path with spaces',
      'htttps://example.com',
      'http:/example.com',
    ])('does not match malofrmed URLs (%s)', url => {
      expect(readEx(segments)).not.toMatchString(url);
    });
  });

  describe('HTML tags', () => {
    const tagName = oneOrMore(anythingFrom(['a', 'z']));
    const segments = [
      startOfLine,
      '<',
      captureGroup(tagName),
      captureGroup(zeroOrMoreLazy(anyCharacter)),
      or(
        concat('>', anything, '</', backReference(1), '>'),
        concat(oneOrMore(whitespaceCharacter), '/>')
      ),
      endOfLine,
    ];

    it.each([
      '<div></div>',
      '<span>...</span>',
      '<a href="https://example.com">Link</a>',
      '<img src="image.jpg" />',
      '<div><p>Hi</p></div>',
    ])('matches valid HTML tags (%s)', tag => {
      expect(readEx(segments, { ignoreCase: true })).toMatchString(tag);
    });

    it.each([
      '<div>',
      '</div>',
      '</a>Link<a href="https://example.com">',
      '</div></p>',
      '<p<div>',
    ])('does not match invalid HTML tags (%s)', tag => {
      expect(readEx(segments, { ignoreCase: true })).not.toMatchString(tag);
    });
  });

  describe('Floating-point numbers', () => {
    const sign = zeroOrOne(or('+', '-'));
    const noSinglePoint = lookahead(or(concat('.', digit), digit));
    const scientificNotation = concat(
      anythingFrom('e', 'E'),
      sign,
      oneOrMore(digit)
    );

    const segments = [
      startOfLine,
      sign,
      noSinglePoint,
      zeroOrOne(oneOrMore(digit)),
      zeroOrOne('.'),
      zeroOrMore(digit),
      zeroOrOne(scientificNotation),
      endOfLine,
    ];

    it.each([
      '0',
      '0.0',
      '1.0',
      '1.234',
      '1234.5678',
      '1234.5678e10',
      '1234.5678E-10',
      '1234.5678e+10',
      '1234e10',
      '1234e-10',
      '1234e+10',
    ])('matches valid floating-point numbers (%s)', number => {
      expect(readEx(segments)).toMatchString(number);
    });

    it.each(['.', '1e', '1e+', '1e-'])(
      'does not match invalid floating-point numbers (%s)',
      number => {
        expect(readEx(segments)).not.toMatchString(number);
      }
    );
  });

  describe('Dates', () => {
    const separator = or('/', '-');

    const noInvalidFeb29a = negativeLookahead(
      or(
        concat(anythingFrom(0, 2, 4, 6, 8), anythingBut(0, 4, 8)),
        concat(anythingFrom(1, 3, 5, 7, 9), anythingBut(2, 6))
      ),
      concat('00', separator, 'Feb', separator, '29')
    );

    const noInvalidFeb29b = negativeLookahead(
      concat('19', anythingFrom([7, 9]), digit),
      or(
        concat(anythingFrom(0, 2, 4, 6, 8), anythingBut(0, 4, 8)),
        concat(anythingFrom(1, 3, 5, 7, 9), anythingBut(2, 6))
      ),
      concat(separator, '02', separator, '29')
    );

    const noInvalidFeb30and31 = negativeLookahead(
      concat('02'),
      separator,
      '3',
      anythingFrom([0, 1])
    );

    const noInvalid31st = negativeLookahead(
      nonCaptureGroup(or('04', '06', '09', '11')),
      separator,
      '31'
    );

    const noZeroDates = negativeLookahead('00');

    const year = or(
      concat('19', anythingFrom([7, 9]), digit),
      concat('20', anythingFrom([0, 2]), digit)
    );

    const month = or(
      // 01-09
      concat(0, digit),
      // 10-12
      concat(1, anythingFrom([0, 2]))
    );

    const date = or(
      // 01-29
      concat(anythingFrom([0, 2]), digit),
      // 30-31
      concat(3, anythingFrom([0, 1]))
    );

    const segments = [
      startOfLine,
      noInvalidFeb29a,
      noInvalidFeb29b,
      namedGroup({ name: 'year' }, year),
      separator,
      noInvalidFeb30and31,
      noInvalid31st,
      namedGroup({ name: 'month' }, month),
      separator,
      noZeroDates,
      namedGroup({ name: 'date' }, date),
      endOfLine,
    ];

    it.each([
      '1970-01-01',
      '1985/12/29',
      '1999-05-31',
      '2004-03-16',
      '2012/02/29',
    ])('matches valid dates (%s)', date => {
      expect(readEx(segments)).toMatchString(date);
    });

    it.each([
      '1970-01-00',
      '1985/13/29',
      '1999-05-32',
      '2004/03/00',
      '2012-02-30',
    ])('does not match invalid dates (%s)', date => {
      expect(readEx(segments)).not.toMatchString(date);
    });
  });
});
