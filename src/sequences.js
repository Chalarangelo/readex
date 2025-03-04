/**
 * An anchor segment that matches the start of a line.
 * In non-multi-line mode, it matches the start of the string.
 */
export const startOfLine = new RegExp('^');

/**
 * An anchor segment that matches the end of a line.
 * In non-multi-line mode, it matches the end of the string.
 */
export const endOfLine = new RegExp('$');

/**
 * An anchor segment that matches the start of a word boundary.
 */
export const wordBoundary = new RegExp(String.raw`\b`);

/**
 * An anchor segment that matches the end of a word boundary.
 */
export const nonWordBoundary = new RegExp(String.raw`\B`);

/**
 * A character class segment that matches any digit.
 */
export const digit = new RegExp(String.raw`\d`);

/**
 * A character class segment that matches any non-digit.
 */
export const nonDigit = new RegExp(String.raw`\D`);

/**
 * A character class segment that matches any word character.
 */
export const wordCharacter = new RegExp(String.raw`\w`);

/**
 * A character class segment that matches any non-word character.
 */
export const nonWordCharacter = new RegExp(String.raw`\W`);

/**
 * A character class segment that matches any whitespace character.
 */
export const whitespaceCharacter = new RegExp(String.raw`\s`);

/**
 * A character class segment that matches any non-whitespace character.
 */
export const nonWhitespaceCharacter = new RegExp(String.raw`\S`);

/**
 * A wildcard segment that matches any single character (/.).
 */
export const anyCharacter = new RegExp('.');

/**
 * A wildcard segment that matches any sequence of characters (/.*).
 */
export const anything = new RegExp('.*');

/**
 * A wildcard segment that matches any single character except line terminators (/./).
 */
export const something = new RegExp('.+');
