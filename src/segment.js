class Segment {
  constructor(expression) {
    if (expression instanceof Segment) this.value = expression.value;
    if (expression instanceof RegExp) this.value = expression.source;
    if (typeof expression === 'string') this.value = expression;
  }
}

export default Segment;
