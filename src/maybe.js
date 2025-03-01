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

class Maybe {
  constructor(expressions, options = {}) {
    this.expression = group(...toSegments(...expressions), { capture: false });
    this.options =
      Object.keys(options).length &&
      (options.lazy === true || options.greedy === false)
        ? { lazy: true }
        : { lazy: false };
  }

  toSegment() {
    return new Segment(`${this.expression}?${this.options.lazy ? '?' : ''}`);
  }
}

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
export const maybe = (...expressionsAndOptions) => {
  if (expressionsAndOptions.length === 0)
    throw new Error('No expressions provided.');

  const last = expressionsAndOptions[expressionsAndOptions.length - 1];

  if (expressionsAndOptions.length !== 1 && isValidOptions(last))
    return new Maybe(expressionsAndOptions.slice(0, -1), last).toSegment();

  return new Maybe(expressionsAndOptions).toSegment();
};
