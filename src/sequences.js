/**
 * An anchor segment that matches the start of a line.
 * In non-multi-line mode, it matches the start of the string.
 */
export const startOfLine = /^/;

/**
 * An anchor segment that matches the end of a line.
 * In non-multi-line mode, it matches the end of the string.
 */
export const endOfLine = /$/;

/**
 * An anchor segment that matches the start of a word boundary.
 */
export const wordBoundary = /\b/;

/**
 * An anchor segment that matches the end of a word boundary.
 */
export const nonWordBoundary = /\B/;

/**
 * A character class segment that matches any digit.
 */
export const digit = /\d/;

/**
 * A character class segment that matches any non-digit.
 */
export const nonDigit = /\D/;

/**
 * A character class segment that matches any word character.
 */
export const wordCharacter = /\w/;

/**
 * A character class segment that matches any non-word character.
 */
export const nonWordCharacter = /\W/;

/**
 * A character class segment that matches any whitespace character.
 */
export const whitespaceCharacter = /\s/;

/**
 * A character class segment that matches any non-whitespace character.
 */
export const nonWhitespaceCharacter = /\S/;

/**
 * A wildcard segment that matches any single character (/.).
 */
export const anyCharacter = /./;

/**
 * A wildcard segment that matches any sequence of characters (/.*).
 */
export const anything = /.*/;

/**
 * A wildcard segment that matches any single character except line terminators (/./).
 */
export const something = /.+/;
