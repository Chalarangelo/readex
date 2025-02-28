import { Segment } from './segment.js';

/**
 * A wildcard segment that matches any single character (/.).
 */
export const anyCharacter = new Segment('.');

/**
 * A wildcard segment that matches any sequence of characters (/.*).
 */
export const anything = new Segment('.*');

/**
 * A wildcard segment that matches any single character except line terminators (/./).
 */
export const something = new Segment('.+');
