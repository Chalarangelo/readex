import { joinSegments, toSegments } from './utils.js';
import { asFlags } from './flags.js';

/**
 * Creates a new regular expression by joining multiple segments and applying specified flags.
 *
 * @param {Array<string|RegExp>} expressions - An array of strings or regular expressions to be joined.
 * @param {Object} [flags={}] - An optional object specifying the flags to be applied to the regular expression.
 * @returns {RegExp} The resulting regular expression.
 */
const readEx = (expressions, flags = {}) =>
  new RegExp(joinSegments(toSegments(...expressions)).source, asFlags(flags));

export default readEx;
