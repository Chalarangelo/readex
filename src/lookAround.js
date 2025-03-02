import { Segment, toSegments } from './segment.js';
import { concat } from './group.js';
import { createOptionsValidator, createOptionsExtractor } from './utils.js';

const isValidOptions = createOptionsValidator(['positive', 'negative'], true);
const extractOptionsAndExpressions = createOptionsExtractor(isValidOptions);

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
