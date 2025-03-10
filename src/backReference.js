import { toSegments } from './utils.js';
/**
 * Generates a back reference segment.
 *
 * @param {number|string} reference - The reference to be back referenced.
 * @returns {RegExp} The back reference segment.
 * @throws {TypeError} Throws if the reference is not a number or a string.
 */
export const backReference = reference => {
  if (typeof reference === 'string')
    return toSegments(`\\k<${reference}`, '>')();
  if (typeof reference === 'number') return toSegments(`\\${reference}`)();
  throw new TypeError('Reference must be a number or a string.');
};
