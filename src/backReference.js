/**
 * Generates a back reference segment.
 *
 * @param {number|string} reference - The reference to be back referenced.
 * @returns {RegExp} The back reference segment.
 * @throws {TypeError} Throws if the reference is not a number or a string.
 */
export const backReference = reference => {
  if (typeof reference === 'number') return new RegExp(`\\${reference}`);
  if (typeof reference === 'string') return new RegExp(`\\k<${reference}>`);
  throw new TypeError('Invalid back reference. Must be a number or a string.');
};
