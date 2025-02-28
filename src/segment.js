import { sanitize } from './sanitize.js';

class Segment {
  constructor(expression) {
    if (expression instanceof Segment) this.value = expression.value;
    if (expression instanceof RegExp) this.value = expression.source;
    if (typeof expression === 'string') this.value = expression;
  }

  toString() {
    return this.value;
  }
}

export const toSegment = expression => {
  if (expression instanceof Segment) return expression;
  if (expression instanceof RegExp) return new Segment(expression);
  return new Segment(sanitize(expression));
};

export const toSegments = (...expressions) => expressions.map(toSegment);

export const joinSegments = (segments, separator = '') =>
  new Segment(segments.join(separator));
