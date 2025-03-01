import { toSegments, joinSegments } from './segment.js';
import { group } from './group.js';

/**
 * Combines multiple expressions into a single non-capturing group segment separated by the OR (`|`) operator.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to be combined.
 * @returns {Segment} The combined expression as a non-capturing group segment.
 */
export const or = (...expressions) => {
  return group(joinSegments(toSegments(...expressions), '|'), {
    capture: false,
  });
};
