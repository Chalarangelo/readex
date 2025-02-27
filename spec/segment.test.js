import { describe, it, expect } from 'vitest';
import Segment from '#src/segment.js';

describe('Segment', () => {
  describe('constructor', () => {
    describe('when value is a Segment instance', () => {
      it('copies the Segment value', () => {
        const segment = new Segment(new Segment('some value'));
        expect(segment.value).toEqual('some value');
      });
    });

    describe('when value is a RegExp instance', () => {
      describe.each([
        ['no special characters', /some value/, 'some value'],
        ['flags', /some value/gi, 'some value'],
        ['special characters', /some value./, 'some value.'],
      ])('and the RegExp contains %s', (_, expression, expected) => {
        it('copies the RegExp source', () => {
          const segment = new Segment(expression);
          expect(segment.value).toEqual(expected);
        });
      });
    });

    describe('when value is a string', () => {
      it('copies the string value', () => {
        const segment = new Segment('some value');
        expect(segment.value).toEqual('some value');
      });
    });
  });
});
