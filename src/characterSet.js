import { Segment, toSegment, toSegments, joinSegments } from './segment.js';

/**
 * Converts an expression to a character set.
 *
 * @param {string | Array} expression - The expression to convert. Must be either a string or a 2-element array.
 * @returns {Segment} A new Segment object representing the character set.
 * @throws {TypeError} If the expression is not a string or a 2-element array.
 */
export const toCharacterSet = expression => {
  if (typeof expression === 'string') return toSegment(expression);
  if (Array.isArray(expression) && expression.length === 2)
    return joinSegments(toSegments(...expression), '-');

  throw new TypeError(
    'Invalid character set expression. Must be a string or a 2-element array.'
  );
};

/**
 * Creates a new Segment that matches any character from the provided expressions.
 *
 * @param {...(string | Array)} expressions - The expressions to include in the character set.
 *    Each expression must be either a string or a 2-element array.
 * @returns {Segment} A new Segment that matches any character from the provided expressions.
 */
export const anythingFrom = (...expressions) =>
  new Segment(`[${joinSegments(expressions.map(toCharacterSet), '|')}]`);

/**
 * Creates a character set that matches any character not in the provided expressions.
 *
 * @param {...string} expressions - The expressions to exclude from the character set.
 *    Each expression must be either a string or a 2-element array.
 * @returns {Segment} A Segment that matches any character not in the provided expressions.
 */
export const anythingBut = (...expressions) =>
  new Segment(`[^${joinSegments(expressions.map(toCharacterSet), '|')}]`);
