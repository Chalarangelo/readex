const sanitize = (val) => {
  if (typeof val !== "string" && typeof val !== "number")
    throw new TypeError("Value must be a string or a number");
  return `${val}`.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&");
};
const toSegment = (expression) => {
  if (expression instanceof RegExp) return new RegExp(expression.source);
  return new RegExp(sanitize(expression));
};
const toSegments = (...expressions) => expressions.map(toSegment);
const joinSegments = (segments, separator = "") => new RegExp(segments.map((s) => s.source).join(separator));
const DEFAULT_FLAGS = {
  dotAll: false,
  global: true,
  ignoreCase: false,
  multiline: true,
  sticky: false,
  unicode: false
};
const FLAG_MAP = {
  dotAll: "s",
  global: "g",
  ignoreCase: "i",
  multiline: "m",
  sticky: "y",
  unicode: "u"
};
const validateFlag = (flag) => {
  if (!Object.keys(DEFAULT_FLAGS).includes(flag))
    throw new TypeError(`Invalid flag: ${flag}`);
  return flag;
};
const asFlags = (flags) => {
  if (!(flags instanceof Object))
    throw new TypeError("flags must be an object");
  return Object.entries(
    Object.entries(flags).reduce(
      (acc, [flag, value]) => {
        if (value !== void 0) acc[validateFlag(flag)] = value;
        return acc;
      },
      { ...DEFAULT_FLAGS }
    )
  ).reduce((acc, [flag, value]) => value ? acc + FLAG_MAP[flag] : acc, "");
};
const readEx = (expressions, flags = {}) => new RegExp(joinSegments(toSegments(...expressions)).source, asFlags(flags));
const backReference = (reference) => {
  if (typeof reference === "number") return new RegExp(`\\${reference}`);
  if (typeof reference === "string") return new RegExp(`\\k<${reference}>`);
  throw new TypeError("Invalid back reference. Must be a number or a string.");
};
const toGroup = (expressions, prefix) => {
  const expression = joinSegments(toSegments(...expressions)).source;
  return new RegExp(`(${prefix}${expression})`);
};
const captureGroup = (...expressions) => toGroup(expressions, "");
const nonCaptureGroup = (...expressions) => toGroup(expressions, "?:");
const namedGroup = (options, ...expressions) => {
  const { name } = options;
  if (!name || typeof name !== "string")
    throw new TypeError("Named groups must have a name.");
  return toGroup(expressions, `?<${name}>`);
};
const concat = nonCaptureGroup;
const or = (...expressions) => nonCaptureGroup(joinSegments(toSegments(...expressions), "|"));
const toLookAround = (expressions, prefix) => {
  const expression = nonCaptureGroup(...toSegments(...expressions)).source;
  return new RegExp(`(?${prefix}${expression})`);
};
const lookahead = (...expressions) => toLookAround(expressions, "=");
const negativeLookahead = (...expressions) => toLookAround(expressions, "!");
const lookbehind = (...expressions) => toLookAround(expressions, "<=");
const negativeLookbehind = (...expressions) => toLookAround(expressions, "<!");
const toQuantifier = (expressions, suffix) => {
  const expression = nonCaptureGroup(...toSegments(...expressions)).source;
  return new RegExp(`${expression}${suffix}`);
};
const toRepeat = (expressions, options) => {
  const { times, lazy } = options;
  const [min = null, max = null] = Array.isArray(times) ? times : [times, times];
  let hasError = min === null && max === null;
  if (min !== null && (!Number.isInteger(min) || min < 0)) hasError = true;
  if (max !== null && (!Number.isInteger(max) || max < 0 || min !== null && min > max))
    hasError = true;
  if (hasError)
    throw new TypeError(
      "Invalid times option: times must be either a number or an array of two numbers."
    );
  const [start, end] = [min ?? 0, max ?? ""];
  const suffix = start === end ? `{${start}}` : `{${start},${end}}`;
  return toQuantifier(expressions, lazy ? `${suffix}?` : suffix);
};
const zeroOrOne = (...expressions) => toQuantifier(expressions, "?");
const zeroOrOneLazy = (...expressions) => toQuantifier(expressions, "??");
const oneOrMore = (...expressions) => toQuantifier(expressions, "+");
const oneOrMoreLazy = (...expressions) => toQuantifier(expressions, "+?");
const zeroOrMore = (...expressions) => toQuantifier(expressions, "*");
const zeroOrMoreLazy = (...expressions) => toQuantifier(expressions, "*?");
const repeat = (options, ...expressions) => toRepeat(expressions, options);
const repeatLazy = (options, ...expressions) => toRepeat(expressions, { ...options, lazy: true });
const startOfLine = /^/;
const endOfLine = /$/;
const wordBoundary = /\b/;
const nonWordBoundary = /\B/;
const digit = /\d/;
const nonDigit = /\D/;
const wordCharacter = /\w/;
const nonWordCharacter = /\W/;
const whitespaceCharacter = /\s/;
const nonWhitespaceCharacter = /\S/;
const anyCharacter = /./;
const anything = /.*/;
const something = /.+/;
const toCharacterSet = (expression) => {
  if (typeof expression === "string" || typeof expression === "number")
    return toSegment(expression);
  if (Array.isArray(expression) && expression.length === 2)
    return joinSegments(toSegments(...expression), "-");
  throw new TypeError(
    "Invalid character set expression. Must be a string, number or a 2-element array."
  );
};
const toAnything = (prefix, ...expressions) => new RegExp(
  `[${prefix}${joinSegments(expressions.map(toCharacterSet), "|").source}]`
);
const anythingFrom = (...expressions) => toAnything("", ...expressions);
const anythingBut = (...expressions) => toAnything("^", ...expressions);
export {
  anyCharacter,
  anything,
  anythingBut,
  anythingFrom,
  backReference,
  captureGroup,
  concat,
  digit,
  endOfLine,
  lookahead,
  lookbehind,
  namedGroup,
  negativeLookahead,
  negativeLookbehind,
  nonCaptureGroup,
  nonDigit,
  nonWhitespaceCharacter,
  nonWordBoundary,
  nonWordCharacter,
  oneOrMore,
  oneOrMoreLazy,
  or,
  readEx,
  repeat,
  repeatLazy,
  something,
  startOfLine,
  whitespaceCharacter,
  wordBoundary,
  wordCharacter,
  zeroOrMore,
  zeroOrMoreLazy,
  zeroOrOne,
  zeroOrOneLazy
};
