import { Segment, toSegments } from './segment.js';
import { group } from './group.js';
import {
  createOptionsValidator,
  createOptionsExtractor,
  isNil,
  isPositiveInteger,
  isNonNegativeInteger,
} from './utils.js';

const isValidQuantity = val => isNil(val) || isNonNegativeInteger(val);
const isValidTimes = isPositiveInteger;

const isValidOptions = createOptionsValidator(['greedy', 'lazy'], true);

const isValidOptionsWithMinMax = val => {
  const { min, max, times, ...options } = val;

  if (!isValidOptions(options)) return false;

  if (times !== undefined) {
    if (!isValidTimes(times))
      throw new Error('Invalid quantifier: times must be a positive integer.');

    if (min !== undefined || max !== undefined)
      throw new Error(
        'Invalid quantifier: times cannot be used with min or max.'
      );

    return true;
  }

  if (!isValidQuantity(min) || !isValidQuantity(max))
    throw new Error(
      'Invalid quantifier: min and max must be non-negative integers.'
    );

  if (!isNil(min) && !isNil(max) && min > max)
    throw new Error(
      'Invalid quantifier: min must be less than or equal to max.'
    );

  return true;
};

const extractOptionsAndExpressionsWithoutMinMax =
  createOptionsExtractor(isValidOptions);
const extractOptionsAndExpressionsWithMinMax = createOptionsExtractor(
  isValidOptionsWithMinMax
);

class Quantifier {
  constructor(type, expressions, options = {}) {
    this.expression = group(...toSegments(...expressions), { capture: false });
    this.suffix = '';

    if (type === 'repeat') {
      const min = options.min ?? options.times ?? 0;
      const max = options.max ?? options.times ?? '';
      this.suffix = min === max ? `{${min}}` : `{${min},${max}}`;
    } else
      this.suffix = {
        maybe: '?',
        oneOrMore: '+',
        zeroOrMore: '*',
      }[type];

    if (
      Object.keys(options).length &&
      (options.lazy === true || options.greedy === false)
    )
      this.suffix += '?';
  }

  toSegment() {
    return new Segment(`${this.expression}${this.suffix}`);
  }
}

const extractOptionsAndExpressions = (
  expressionsAndOptions,
  includeMinMax = false
) =>
  includeMinMax
    ? extractOptionsAndExpressionsWithMinMax(expressionsAndOptions)
    : extractOptionsAndExpressionsWithoutMinMax(expressionsAndOptions);

/**
 * Creates a new non-capturing group segment that optionally matches
 * the provided expressions.
 *
 * @param {...any} expressionsAndOptions - The expressions and options to group.
 *    The last argument can be an options object with one of the following properties:
 *     - greedy: boolean - Whether the group should be greedy (default).
 *     - lazy: boolean - Whether the group should be lazy.
 * @throws {Error} If no expressions are provided.
 * @returns {Segment} The new group segment.
 */
export const maybe = (...expressionsAndOptions) =>
  new Quantifier(
    'maybe',
    ...extractOptionsAndExpressions(expressionsAndOptions)
  ).toSegment();

/**
 * Creates a new non-capturing group segment that matches
 * one or more of the provided expressions.
 *
 * @param {...any} expressionsAndOptions - The expressions and options to group.
 *   The last argument can be an options object with one of the following properties:
 *    - greedy: boolean - Whether the group should be greedy (default).
 *    - lazy: boolean - Whether the group should be lazy.
 * @throws {Error} If no expressions are provided.
 * @returns {Segment} The new group segment.
 */
export const oneOrMore = (...expressionsAndOptions) =>
  new Quantifier(
    'oneOrMore',
    ...extractOptionsAndExpressions(expressionsAndOptions)
  ).toSegment();

/**
 * Creates a new non-capturing group segment that matches
 * zero or more of the provided expressions.
 *
 * @param {...any} expressionsAndOptions - The expressions and options to group.
 *   The last argument can be an options object with one of the following properties:
 *    - greedy: boolean - Whether the group should be greedy (default).
 *    - lazy: boolean - Whether the group should be lazy.
 * @throws {Error} If no expressions are provided.
 * @returns {Segment} The new group segment.
 */
export const zeroOrMore = (...expressionsAndOptions) =>
  new Quantifier(
    'zeroOrMore',
    ...extractOptionsAndExpressions(expressionsAndOptions)
  ).toSegment();

/**
 * Creates a new non-capturing group segment that matches
 * the provided expressions a specific number of times.
 *
 * @param {...any} expressionsAndOptions - The expressions and options to group.
 *   The last argument can be an options object with the following properties:
 *    - greedy: boolean - Whether the group should be greedy (default, mutually exclusive with lazy).
 *    - lazy: boolean - Whether the group should be lazy (mutually exclusive with greedy).
 *    - min: number - The minimum number of times the group should match.
 *    - max: number - The maximum number of times the group should match.
 *    - times: number - A shorthand for setting both min and max to the same value.
 * @throws {Error} If no expressions are provided or if min or max are invalid.
 * @returns {Segment} The new group segment.
 */
export const repeat = (...expressionsAndOptions) =>
  new Quantifier(
    'repeat',
    ...extractOptionsAndExpressions(expressionsAndOptions, true)
  ).toSegment();
