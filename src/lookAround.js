import { Segment, toSegments } from './segment.js';
import { concat } from './group.js';

const toLookAround = (expressions, options) => {
  const expression = concat(...toSegments(...expressions)).source;
  const prefix = `?${options.lookbehind ? '<' : ''}${
    options.negative ? '!' : '='
  }`;
  return new Segment(`(${prefix}${expression})`);
};

/**
 * Creates a new loohahead group segment with the provided expressions.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to group.
 * @returns {Segment} The new loohahead group segment.
 */
export const lookahead = (...expressions) =>
  toLookAround(expressions, { lookbehind: false, negative: false });

/**
 * Creates a new negative loohahead group segment with the provided expressions.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to group.
 * @returns {Segment} The new loohahead group segment.
 */
export const negativeLookahead = (...expressions) =>
  toLookAround(expressions, { lookbehind: false, negative: true });

/**
 * Creates a new lookbehind group segment with the provided expressions.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to group.
 * @returns {Segment} The new lookbehind group segment.
 */
export const lookbehind = (...expressions) =>
  toLookAround(expressions, { lookbehind: true, negative: false });

/**
 * Creates a new negative lookbehind group segment with the provided expressions.
 *
 * @param {...(Segment|RegExp|string)} expressions - The expressions to group.
 * @returns {Segment} The new lookbehind group segment.
 */
export const negativeLookbehind = (...expressions) =>
  toLookAround(expressions, { lookbehind: true, negative: true });
