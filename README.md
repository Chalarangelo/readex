# readex

readex (pronounced /rɛdɛks/) is a more **read**able Reg**Ex**p syntax for JS.

## Installation

```bash
npm install readex
```

## Usage

Import any of the functions you need, build **reusable patterns**, pass them to `readEx` and test them against a string.

```js
import {
  readEx,
  concat,
  zeroOrMore,
  or,
  zeroOrOne,
  anythingFrom,
  repeat,
  digit,
  startOfLine,
  endOfLine
} from 'readex';

// Reusable octet pattern (0-255)
const octet = concat(
  zeroOrMore(0),
  or(
    concat(zeroOrOne(anythingFrom([0, 1])), repeat({ times: [1, 2] }, digit)),
    concat(2, anythingFrom([0, 4]), digit),
    concat(25, anythingFrom([0, 5]))
  )
);

// Example: Matching IPv4 addresses
readEx([startOfLine, octet, '.', octet, '.', octet, '.', octet, endOfLine])
  .test('192.168.1.1'); // true
```

## API

The API is based on convenience of use. All functions expect **any number of patterns** (strings or `RegExp`) and return a new `RegExp`. If **additional arguments** need to be supplied, they are supplied as the **first argument** of the function.

Notable **exceptions** to this rule are `readEx`, and `backreference`.

### `readEx`

`readEx` is the main function that combines all patterns into a single `RegExp`. It accepts an **array of patterns** and an optional `flags` object. The `flags` object can contain any of the following **boolean** properties:
- `global` - Whether the `RegExp` should be global (`g`).
- `multiline` - Whether the `RegExp` should be multiline (`m`).
- `ignoreCase` - Whether the `RegExp` should be case-insensitive (`i`).
- `dotAll` - Whether the `RegExp` should match any character including newlines (`s`).
- `unicode` - Whether the `RegExp` should be unicode-aware (`u`).
- `sticky` - Whether the `RegExp` should be sticky (`y`).

```js
import { readEx, startOfLine, endOfLine } from 'readex';

readEx([startOfLine, 'hello', endOfLine], { ignoreCase: true });
```

### Common sequences

Common sequences are exported as **constants**.

- `startOfLine` - Matches the start of a line (`^`).
- `endOfLine` - Matches the end of a line (`$`).
- `wordBoundary` - Matches a word boundary (`\b`).
- `nonWordBoundary` - Matches a non-word boundary (`\B`).
- `digit` - Matches a digit (`\d`).
- `nonDigit` - Matches a non-digit (`\D`).
- `wordCharacter` - Matches a word character (`\w`).
- `nonWordCharacter` - Matches a non-word character (`\W`).
- `whitespaceCharacter` - Matches a whitespace character (`\s`).
- `nonWhitespaceCharacter` - Matches a non-whitespace character (`\S`).
- `anyCharacter` - Matches any character (`.`).
- `anything` - Matches anything (`.*`).
- `something` - Matches something (`.+`).

### Character sets and ranges

Character sets and ranges are exported as **functions**.

- `anythingFrom` - Matches any character from a set of characters or ranges (`[]`).
- `anythingBut` - Matches any character except those in a set of characters or ranges (`[^]`).

These two functions also **accept 2-element arrays as any of their arguments**, creating a **range** between the two elements. For example, `anythingFrom([0, 6])` matches digits from 0 to 6.

```js
import { readEx, anythingFrom, digit } from 'readex';

readEx([anythingFrom([0, 6], 9)]);
// Match any digit from 0 to 6 or 9
```

### Quantifiers

Quantifiers are exported as **functions**.

- `zeroOrOne` - Matches zero or one of the preceding pattern (`?`).
- `zeroOrOneLazy` - Matches zero or one of the preceding pattern (`??`).
- `zeroOrMore` - Matches zero or more of the preceding pattern (`*`).
- `zeroOrMoreLazy` - Matches zero or more of the preceding pattern (`*?`).
- `oneOrMore` - Matches one or more of the preceding pattern (`+`).
- `oneOrMoreLazy` - Matches one or more of the preceding pattern (`+?`).
- `repeat` - Matches a specific number of the preceding pattern.
- `repeatLazy` - Matches a specific number of the preceding pattern.

The `repeat` and `repeatLazy` quantifiers accept an **object** with a singular `times` key as the **first argument**. The value of `times` can be:
- A number, e.g. `repeat({ times: 3 }, 'a')` matches `'aaa'`.
- An array of two numbers, e.g. `repeat({ times: [2, 4] }, 'a')` matches `'aa'`, `'aaa'` and `'aaaa'`.
- An array of one number and an empty value, e.g. `repeat({ times: [2, ] }, 'a')` matches `'aa'` and more.
- An array of one empty value and a number, e.g. `repeat({ times: [, 4] }, 'a')` matches `'a'`, `'aa'`, `'aaa'` and `'aaaa'`.

```js
import { readEx, zeroOrMore, repeat, digit } from 'readex';

readEx([zeroOrMore(digit)]); // Match any number of digits
readEx([zeroOrOne('A', /_/, digit)]); // Match zero or one of 'A', '_' or a digit
readEx([repeat({ times: [2, 4] }, digit)]); // Match 2-4 digits
```

### Group constructs

Group constructs are exported as **functions**.

- `captureGroup` - Creates a capturing group (`()`).
- `nonCaptureGroup` - Creates a non-capturing group (`(?:)`).
- `namedGroup` - Creates a named capturing group (`(?<name>)`).
- `concat` - Concatenates multiple patterns (alias for `nonCaptureGroup`).
- `or` - Matches any of the patterns (`|`).

The `namedGroup` function accepts a **string as the first argument**, which is the name of the group, e.g. `namedGroup('digit', digit)`.

```js
import { readEx, captureGroup, or, digit } from 'readex';

readEx([captureGroup(or('a', 'b', 'c')), digit]);
// Match 'a', 'b' or 'c' followed by a digit

readEx([namedGroup('digit', digit)]);
// Match a digit and capture it as 'digit'
```

### Lookaround assertions

Lookaheads and lookbehinds are exported as **functions**.

- `lookahead` - Matches a pattern only if it is followed by another pattern (`(?=)`).
- `negativeLookahead` - Matches a pattern only if it is not followed by another pattern (`(?!)`).
- `lookbehind` - Matches a pattern only if it is preceded by another pattern (`(?<=)`).
- `negativeLookbehind` - Matches a pattern only if it is not preceded by another pattern (`(?<!)`).

```js
import { readEx, lookahead, digit } from 'readex';

readEx([lookahead(digit), digit]);
// Match a digit only if it is followed by another digit
```

### Backreferences

Backreferences are exported as **functions**. They accept a **single argument**, which is the index or name of the capturing group to reference.

- `backreference` - Matches the same text as a previously captured group (`\1` or `<name>`).

```js
import { readEx, captureGroup, namedGroup, backreference } from 'readex';

readEx([captureGroup(digit), backreference(1)]);
// Match a digit followed by the same digit (numbered group)

readEx([namedGroup('digit', digit), backreference('digit')]);
// Match a digit followed by the same digit (named group)
```
