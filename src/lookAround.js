import { Segment, toSegments } from './segment.js';
import { concat } from './group.js';
import { createOptionsValidator, createOptionsExtractor } from './utils.js';

const isValidOptions = createOptionsValidator(['positive', 'negative'], true);
const extractOptionsAndExpressions = createOptionsExtractor(isValidOptions);

class LookAround {
  constructor(type, expressions, options = {}) {
    this.expression = concat(...toSegments(...expressions));
    this.prefix = `?${type === 'lookbehind' ? '<' : ''}`;
    this.prefix +=
      Object.keys(options).length &&
      (options.negative === true || options.positive === false)
        ? '!'
        : '=';
  }

  toSegment() {
    return new Segment(`(${this.prefix}${this.expression})`);
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
  new LookAround(
    'lookahead',
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
  new LookAround(
    'lookbehind',
    ...extractOptionsAndExpressions(expressionsAndOptions)
  ).toSegment();
