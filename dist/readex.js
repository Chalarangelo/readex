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
const toGroup = (expressions, options) => {
  const expression = joinSegments(toSegments(...expressions)).source;
  const { capture, name } = options;
  if (name) return new RegExp(`(?<${name}>${expression})`);
  if (capture) return new RegExp(`(${expression})`);
  return new RegExp(`(?:${expression})`);
};
const captureGroup = (...expressions) => toGroup(expressions, { capture: true });
const nonCaptureGroup = (...expressions) => toGroup(expressions, { capture: false });
const namedGroup = (options, ...expressions) => {
  const { name } = options;
  if (!name || typeof name !== "string")
    throw new TypeError("Named groups must have a name.");
  return toGroup(expressions, { name });
};
const concat = (...expressions) => nonCaptureGroup(...expressions);
const or = (...expressions) => nonCaptureGroup(joinSegments(toSegments(...expressions), "|"));
const toLookAround = (expressions, options) => {
  const expression = concat(...toSegments(...expressions)).source;
  const prefix = `?${options.lookbehind ? "<" : ""}${options.negative ? "!" : "="}`;
  return new RegExp(`(${prefix}${expression})`);
};
const lookahead = (...expressions) => toLookAround(expressions, { lookbehind: false, negative: false });
const negativeLookahead = (...expressions) => toLookAround(expressions, { lookbehind: false, negative: true });
const lookbehind = (...expressions) => toLookAround(expressions, { lookbehind: true, negative: false });
const negativeLookbehind = (...expressions) => toLookAround(expressions, { lookbehind: true, negative: true });
const toQuantifier = (expressions, options) => {
  const expression = nonCaptureGroup(...toSegments(...expressions)).source;
  const { suffix, lazy } = options;
  return new RegExp(`${expression}${suffix}${lazy ? "?" : ""}`);
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
  return toQuantifier(expressions, { suffix, lazy });
};
const zeroOrOne = (...expressions) => toQuantifier(expressions, { suffix: "?" });
const zeroOrOneLazy = (...expressions) => toQuantifier(expressions, { suffix: "?", lazy: true });
const oneOrMore = (...expressions) => toQuantifier(expressions, { suffix: "+" });
const oneOrMoreLazy = (...expressions) => toQuantifier(expressions, { suffix: "+", lazy: true });
const zeroOrMore = (...expressions) => toQuantifier(expressions, { suffix: "*" });
const zeroOrMoreLazy = (...expressions) => toQuantifier(expressions, { suffix: "*", lazy: true });
const repeat = (options, ...expressions) => toRepeat(expressions, options);
const repeatLazy = (options, ...expressions) => toRepeat(expressions, { ...options, lazy: true });
const startOfLine = new RegExp("^");
const endOfLine = new RegExp("$");
const wordBoundary = new RegExp(String.raw`\b`);
const nonWordBoundary = new RegExp(String.raw`\B`);
const digit = new RegExp(String.raw`\d`);
const nonDigit = new RegExp(String.raw`\D`);
const wordCharacter = new RegExp(String.raw`\w`);
const nonWordCharacter = new RegExp(String.raw`\W`);
const whitespaceCharacter = new RegExp(String.raw`\s`);
const nonWhitespaceCharacter = new RegExp(String.raw`\S`);
const anyCharacter = new RegExp(".");
const anything = new RegExp(".*");
const something = new RegExp(".+");
export {
  anyCharacter,
  anything,
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
