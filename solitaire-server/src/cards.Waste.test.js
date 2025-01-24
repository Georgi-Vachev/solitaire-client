import { jest, expect, test, describe, beforeEach } from '@jest/globals';
import { Card, Stack, stacks, faces, suits } from './cards.js';


describe('Waste', () => {
    /** @type {Stack} */
    let stack = null;

    beforeEach(() => {
        stack = new Stack(stacks.Waste);
    });

    describe('Empty', () => {
        
        test('cannot flip', () => {
            expect(stack.canFlip()).toBeFalsy();
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
            stack.cards.push(new Card(faces.Jack, suits.Clubs, true));
            stack.cards.push(new Card(faces.Four, suits.Diamonds, true));
        });

        test('cannot flip', () => {
            expect(stack.canFlip()).toBeFalsy();
        });

        test('cannot take bottom', () => {
            expect(stack.canTake(0)).toBeFalsy();
        });

        test('cannot take greater than top', () => {
            expect(stack.canTake(2)).toBeFalsy();
        });

        test('can take top', () => {
            expect(stack.canTake(1)).toBeTruthy();
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
