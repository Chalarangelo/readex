import { Segment, toSegments } from './segment.js';
import { group } from './group.js';

const OPTIONS_KEYS = ['greedy', 'lazy'];

const isValidOptions = val =>
  typeof val === 'object' &&
  val !== null &&
  Object.entries(val).every(
    ([key, value], i) =>
      i === 0 && OPTIONS_KEYS.includes(key) && typeof value === 'boolean'
  );

class Quantifier {
  constructor(type, expressions, options = {}) {
    this.type = type;
    this.expression = group(...toSegments(...expressions), { capture: false });
    this.options =
      Object.keys(options).length &&
      (options.lazy === true || options.greedy === false)
        ? { lazy: true }
        : { lazy: false };
  }

  toSegment() {
    return new Segment(`${this.expression}${this.suffix}${this.lazySuffix}`);
  }

  get suffix() {
    return {
      maybe: '?',
      oneOrMore: '+',
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
}

const extractOptionsAndExpressions = expressionsAndOptions => {
  if (expressionsAndOptions.length === 0)
    throw new Error('No expressions provided.');

  const last = expressionsAndOptions[expressionsAndOptions.length - 1];

  if (expressionsAndOptions.length !== 1 && isValidOptions(last))
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
