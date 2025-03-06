const sanitize = (val) => {
  if (typeof val !== "string" && typeof val !== "number")
    throw new TypeError("Value must be a string or a number");
  return `${val}`.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&");
};
const toSegment = (expression) => {
  if (expression instanceof RegExp) return new RegExp(expression.source);
  return new RegExp(sanitize(expression));
};
const joinSegments = (expressions, separator = "") => new RegExp(
  expressions.map(toSegment).map((s) => s.source).join(separator)
);
const wrapSegments = (prefix = "", suffix = "", separator = "", mapFn = (x) => x) => (...expressions) => new RegExp(
  `${prefix}${joinSegments(expressions.map(mapFn), separator).source}${suffix}`
);
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
const readEx = (expressions, flags = {}) => new RegExp(joinSegments(expressions).source, asFlags(flags));
const backReference = (reference) => {
  if (typeof reference === "number") return new RegExp(`\\${reference}`);
  if (typeof reference === "string") return new RegExp(`\\k<${reference}>`);
  throw new TypeError("Invalid back reference. Must be a number or a string.");
};
const captureGroup = wrapSegments("(", ")");
const nonCaptureGroup = wrapSegments("(?:", ")");
const namedGroup = ({ name }, ...expressions) => {
  if (!name || typeof name !== "string")
    throw new TypeError("Named groups must have a name.");
  return wrapSegments(`(?<${name}>`, ")")(...expressions);
};
const concat = nonCaptureGroup;
const or = wrapSegments(`(?:`, ")", "|");
const lookahead = wrapSegments(`(?=(?:`, `))`);
const negativeLookahead = wrapSegments(`(?!(?:`, `))`);
const lookbehind = wrapSegments(`(?<=(?:`, `))`);
const negativeLookbehind = wrapSegments(`(?<!(?:`, `))`);
const toRepeatSuffix = (times) => {
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
  return start === end ? `{${start}}` : `{${start},${end}}`;
};
const zeroOrOne = wrapSegments(`(?:`, `)?`);
const zeroOrOneLazy = wrapSegments(`(?:`, `)??`);
const oneOrMore = wrapSegments(`(?:`, `)+`);
const oneOrMoreLazy = wrapSegments(`(?:`, `)+?`);
const zeroOrMore = wrapSegments(`(?:`, `)*`);
const zeroOrMoreLazy = wrapSegments(`(?:`, `)*?`);
const repeat = ({ times }, ...expressions) => wrapSegments("(?:", `)${toRepeatSuffix(times)}`)(...expressions);
const repeatLazy = ({ times }, ...expressions) => wrapSegments("(?:", `)${toRepeatSuffix(times)}?`)(...expressions);
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
  if (Array.isArray(expression) && expression.length === 2)
    return joinSegments(expression, "-");
  return joinSegments([expression]);
};
const toAnything = (prefix) => wrapSegments(`[${prefix}`, "]", "|", toCharacterSet);
const anythingFrom = toAnything("");
const anythingBut = toAnything("^");
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
