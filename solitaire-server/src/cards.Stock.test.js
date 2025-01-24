import { jest, expect, test, describe, beforeEach } from '@jest/globals';
import { Card, Stack, stacks, faces, suits } from './cards.js';


describe('Stock', () => {
    /** @type {Stack} */
    let stack = null;

    beforeEach(() => {
        stack = new Stack(stacks.Stock);
    });

    describe('Empty', () => {

        test('can flip (recycle waste)', () => {
            expect(stack.canFlip()).toBeTruthy();
        });

        test('cannot take', () => {
            expect(stack.canTake(0)).toBeFalsy();
        });

        test('cannot place anything', () => {
            let card = new Card(faces.Ace, suits.Clubs, true);
            expect(stack.canPlace(card)).toBeFalsy();

            card = new Card(faces.Two, suits.Clubs, true);
            expect(stack.canPlace(card)).toBeFalsy();

            card = new Card(faces.King, suits.Clubs, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });
    });

    describe('Two cards on stack', () => {
        beforeEach(() => {
            stack.cards.push(new Card(faces.Jack, suits.Clubs, false));
            stack.cards.push(new Card(faces.Four, suits.Diamonds, false));
        });

        test('can flip', () => {
            expect(stack.canFlip()).toBeTruthy();
        });

        test('cannot take anything', () => {
            expect(stack.canTake(0)).toBeFalsy();
            expect(stack.canTake(1)).toBeFalsy();
            expect(stack.canTake(2)).toBeFalsy();
        });

        test('cannot place anything', () => {
            let card = new Card(faces.Ace, suits.Clubs, true);
            expect(stack.canPlace(card)).toBeFalsy();

            card = new Card(faces.Two, suits.Clubs, true);
            expect(stack.canPlace(card)).toBeFalsy();

            card = new Card(faces.King, suits.Clubs, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });
    });
});
