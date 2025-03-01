import { Segment, toSegments } from './segment.js';
import { concat } from './group.js';

const OPTIONS_KEYS = ['positive', 'negative'];

const isValidOptions = val =>
  typeof val === 'object' &&
  val !== null &&
  Object.entries(val).every(
    ([key, value], i) =>
      i === 0 && OPTIONS_KEYS.includes(key) && typeof value === 'boolean'
  );

const extractOptionsAndExpressions = expressionsAndOptions => {
  if (expressionsAndOptions.length === 0)
    throw new Error('No expressions provided.');

  const last = expressionsAndOptions[expressionsAndOptions.length - 1];

  if (expressionsAndOptions.length !== 1 && isValidOptions(last))
    return [expressionsAndOptions.slice(0, -1), last];

  return [expressionsAndOptions];
};

class LookAround {
  constructor(type, expressions, options = {}) {
    this.type = type;
    this.expression = concat(...toSegments(...expressions));

    this.options =
      Object.keys(options).length &&
      (options.negative === true || options.positive === false)
        ? { negative: true }
        : { negative: false };
  }

  toSegment() {
    return new Segment(`(${this.prefix}${this.expression})`);
  }

  get prefix() {
    return {
      lookahead: {
        positive: '?=',
        negative: '?!',
      },
      lookbehind: {
        positive: '?<=',
        negative: '?<!',
      },
    }[this.type][this.options.negative ? 'negative' : 'positive'];
  }

  static lookeahead(expressions, options = {}) {
    return new LookAround('lookahead', expressions, options);
  }

  static lookbehind(expressions, options = {}) {
    return new LookAround('lookbehind', expressions, options);
  }
}

/**
 * Creates a new lookahead group segment with the provided expressions.
 *
 * @param {...any} expressionsAndOptions - The expressions and options to group.
 *    The last argument can be an options object with the following properties:
 *     - positive: boolean - Whether the pattern should be positive (default).
 *     - negative: boolean - Whether the pattern should be negative.
 * @throws {Error} If no expressions are provided.
 * @returns {Segment} The new lookahead group segment.
 */
export const lookahead = (...expressionsAndOptions) =>
  LookAround.lookeahead(
    ...extractOptionsAndExpressions(expressionsAndOptions)
  ).toSegment();

/**
 * Creates a new lookbehind group segment with the provided expressions.
 *
 * @param {...any} expressionsAndOptions - The expressions and options to group.
 *    The last argument can be an options object with the following properties:
 *     - positive: boolean - Whether the pattern should be positive (default).
 *     - negative: boolean - Whether the pattern should be negative.
 * @throws {Error} If no expressions are provided.
 * @returns {Segment} The new lookbehind group segment.
 */
export const lookbehind = (...expressionsAndOptions) =>
  LookAround.lookbehind(
    ...extractOptionsAndExpressions(expressionsAndOptions)
  ).toSegment();
