import { sanitize } from './sanitize.js';

/**
 * Converts the given expression to a RegExp segment.
 *
 * @param {RegExp|string} expression - The expression to convert.
 * @returns {RegExp} - The resulting segment.
 */
export const toSegment = expression => {
  if (expression instanceof RegExp) return new RegExp(expression.source);
  return new RegExp(sanitize(expression));
};

/**
 * Converts a list of expressions into segments.
 *
 * @param {...(RegExp|string)} expressions - The expressions to convert.
 * @returns {RegExp[]} An array of segments.
 */
export const toSegments = (...expressions) => expressions.map(toSegment);

/**
 * Joins an array of segments into a single segment, using the specified separator.
 *
 * @param {RegExp[]} segments - The array of segments to join.
 * @param {string} [separator=''] - The separator to use between segments.
 * @returns {RegExp} A new segment object containing the joined segments.
 */
export const joinSegments = (segments, separator = '') =>
  new RegExp(segments.map(s => s.source).join(separator));
