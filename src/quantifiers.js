import { Segment, toSegments } from './segment.js';
import { group } from './group.js';

const OPTIONS_KEYS = ['greedy', 'lazy'];

const isNil = val => val === undefined || val === null;

const isValidQuantity = val =>
  isNil(val) || (Number.isInteger(val) && val >= 0);

const isValidTimes = val => Number.isInteger(val) && val > 0;

// Note: The last check returns true if the object is empty.
const isValidOptions = val =>
  !isNil(val) &&
  typeof val === 'object' &&
  !(val instanceof RegExp) &&
  Object.entries(val).every(
    ([key, value], i) =>
      i === 0 && OPTIONS_KEYS.includes(key) && typeof value === 'boolean'
  );

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

class Quantifier {
  constructor(type, expressions, options = {}) {
    this.type = type;
    this.expression = group(...toSegments(...expressions), { capture: false });

    this.options =
      Object.keys(options).length &&
      (options.lazy === true || options.greedy === false)
        ? { lazy: true }
        : { lazy: false };

    if (type === 'repeat') {
      this.min = options.min ?? options.times ?? null;
      this.max = options.max ?? options.times ?? null;
    }
  }

  toSegment() {
    return new Segment(`${this.expression}${this.suffix}${this.lazySuffix}`);
  }

  get suffix() {
    if (this.type === 'repeat') {
      if (this.min === null && this.max === null)
        throw new Error('Invalid quantifier: must have a min or max value.');

      if (this.min === this.max) return `{${this.min}}`;
      if (this.min === null) return `{0,${this.max}}`;
      if (this.max === null) return `{${this.min},}`;
      return `{${this.min},${this.max}}`;
    }

    return {
      maybe: '?',
      oneOrMore: '+',
      zeroOrMore: '*',
    }[this.type];
  }

  get lazySuffix() {
    return this.options.lazy ? '?' : '';
  }

  static maybe(expressions, options) {
    return new Quantifier('maybe', expressions, options);
  }

  static oneOrMore(expressions, options) {
    return new Quantifier('oneOrMore', expressions, options);
  }

  static zeroOrMore(expressions, options) {
    return new Quantifier('zeroOrMore', expressions, options);
  }

  static repeat(expressions, options) {
    return new Quantifier('repeat', expressions, options);
  }
}

const extractOptionsAndExpressions = (
  expressionsAndOptions,
  includeMinMax = false
) => {
  if (expressionsAndOptions.length === 0)
    throw new Error('No expressions provided.');

  const last = expressionsAndOptions[expressionsAndOptions.length - 1];

  const checkOptions = includeMinMax
    ? isValidOptionsWithMinMax
    : isValidOptions;
  if (expressionsAndOptions.length !== 1 && checkOptions(last))
    return [expressionsAndOptions.slice(0, -1), last];

  return [expressionsAndOptions];
};

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
  Quantifier.maybe(
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
  Quantifier.oneOrMore(
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
  Quantifier.zeroOrMore(
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
  Quantifier.repeat(
    ...extractOptionsAndExpressions(expressionsAndOptions, true)
  ).toSegment();
