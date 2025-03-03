import { Segment, toSegments } from './segment.js';
import { concat } from './group.js';
import { createOptionsValidator, createOptionsExtractor } from './utils.js';

const isValidOptions = createOptionsValidator(['positive', 'negative'], true);
const extractOptionsAndExpressions = createOptionsExtractor(isValidOptions);

const createLookAround = (type, expressions, options = {}) => {
  const expression = concat(...toSegments(...expressions));
  let prefix = `?${type === 'lookbehind' ? '<' : ''}`;
  prefix +=
    Object.keys(options).length && (options.negative || !options.positive)
      ? '!'
      : '=';

  return new Segment(`(${prefix}${expression})`);
};

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
  createLookAround(
    'lookahead',
    ...extractOptionsAndExpressions(expressionsAndOptions)
  );

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
  createLookAround(
    'lookbehind',
    ...extractOptionsAndExpressions(expressionsAndOptions)
  );
