import { sanitize } from './sanitize.js';

class Segment {
  constructor(expression) {
    if (expression instanceof Segment) this.value = expression.value;
    if (expression instanceof RegExp) this.value = expression.source;
    if (typeof expression === 'string') this.value = expression;
  }

  toString() {
    return this.value;
  }
}

/**
 * Converts the given expression to a Segment instance.
 *
 * @param {Segment|RegExp|string} expression - The expression to convert.
 * @returns {Segment} - The resulting Segment instance.
 */
export const toSegment = expression => {
  if (expression instanceof Segment) return expression;
  if (expression instanceof RegExp) return new Segment(expression);
  return new Segment(sanitize(expression));
};

/**
 * Converts a list of expressions into segments.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to convert.
 * @returns {Segment[]} An array of segments.
 */
export const toSegments = (...expressions) => expressions.map(toSegment);

/**
 * Joins an array of segments into a single Segment object, using the specified separator.
 *
 * @param {Segment[]} segments - The array of segments to join.
 * @param {string} [separator=''] - The separator to use between segments.
 * @returns {Segment} A new Segment object containing the joined segments.
 */
export const joinSegments = (segments, separator = '') =>
  new Segment(segments.join(separator));
