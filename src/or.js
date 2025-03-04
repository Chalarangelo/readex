import { toSegments, joinSegments } from './segment.js';
import { nonCaptureGroup } from './group.js';

/**
 * Combines multiple expressions into a single non-capturing group segment separated by the OR (`|`) operator.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to be combined.
 * @returns {Segment} The combined expression as a non-capturing group segment.
 */
export const or = (...expressions) =>
  nonCaptureGroup(joinSegments(toSegments(...expressions), '|'));
