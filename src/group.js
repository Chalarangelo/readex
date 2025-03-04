import { Segment, toSegments, joinSegments } from './segment.js';

const toGroup = (expressions, options) => {
  const expression = joinSegments(toSegments(...expressions));
  const { capture, name } = options;

  if (name) return new Segment(`(?<${name}>${expression})`);
  if (capture) return new Segment(`(${expression})`);
  return new Segment(`(?:${expression})`);
};

/**
 * Creates a new capturing group segment with the provided expressions.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to group.
 * @returns {Segment} The new group segment.
 */
export const captureGroup = (...expressions) =>
  toGroup(expressions, { capture: true });

/**
 * Creates a new non-capturing group segment with the provided expressions.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to group.
 * @returns {Segment} The new group segment.
 */
export const nonCaptureGroup = (...expressions) =>
  toGroup(expressions, { capture: false });

/**
 * Creates a new named group segment with the provided expressions.
 *
 * @param {Object} options - The group options.
 * @param {string} options.name - The name of the group.
 * @param {...(Segment|RegExp|string)} expressions - The expressions to group.
 * @throws {TypeError} If the group name is not a string.
 * @returns {Segment} The new group segment.
 */
export const namedGroup = (options, ...expressions) => {
  const { name } = options;
  if (!name || typeof name !== 'string')
    throw new TypeError('Named groups must have a name.');
  return toGroup(expressions, { name });
};

/**
 * Combines multiple expressions into a single non-capturing group segment.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to be combined.
 * @returns {Segment} The combined expression as a non-capturing group segment.
 */
export const concat = (...expressions) => nonCaptureGroup(...expressions);
