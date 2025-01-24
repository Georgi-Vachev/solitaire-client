import { jest, expect, test, describe, beforeEach } from '@jest/globals';
import { Card, Stack, stacks, faces, suits } from './cards.js';


describe('Foundation', () => {
    /** @type {Stack} */
    let stack = null;

    const sameSuit = suits.Spades;
    const otherSuit = suits.Clubs;

    beforeEach(() => {
        stack = new Stack(stacks.Foundation, sameSuit);
    });

    describe('Empty', () => {

        test('cannot flip', () => {
            expect(stack.canFlip()).toBeFalsy();
        });

        test('cannot take', () => {
            expect(stack.canTake(0)).toBeFalsy();
        });

        test('cannot place greater than Ace of same suit', () => {
            const card = new Card(faces.Two, sameSuit, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('cannot place greater than Ace of another suit', () => {
            const card = new Card(faces.Two, otherSuit, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('cannot place Ace of another suit', () => {
            const card = new Card(faces.Ace, otherSuit, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('can place Ace of same suit', () => {
            const card = new Card(faces.Ace, sameSuit, true);
            expect(stack.canPlace(card)).toBeTruthy();
        });

        test('attempt to place wrong card fails', () => {
            const card = new Card(faces.Ace, otherSuit, true);
            stack.place(card);

            expect(stack.cards.length).toBe(0);
        });

        test('attempt to place correct card succeeds', () => {
            const card = new Card(faces.Ace, sameSuit, true);
            stack.place(card);

            expect(stack.cards.length).toBe(1);
        });

        test('attempt to take card fails', () => {
            expect(stack.take(0)).toBe(null);
        });
    });

    describe('Two cards on stack', () => {
        beforeEach(() => {
            stack.cards.push(new Card(faces.Ace, sameSuit, true));
            stack.cards.push(new Card(faces.Two, sameSuit, true));
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

        test('cannot place smaller than top', () => {
            const card = new Card(faces.Ace, sameSuit, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('cannot place same as top', () => {
            const card = new Card(faces.Two, sameSuit, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('cannot place two-greater than top', () => {
            const card = new Card(faces.Four, sameSuit, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('cannot place another suit', () => {
            const card = new Card(faces.Three, otherSuit, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('can place one-greater than top', () => {
            const card = new Card(faces.Three, sameSuit, true);
            expect(stack.canPlace(card)).toBeTruthy();
        });

        test('attempt to place wrong card fails', () => {
            const card = new Card(faces.Four, sameSuit, true);
            stack.place(card);

            expect(stack.cards.length).toBe(2);
        });

        test('attempt to place correct card succeeds', () => {
            const card = new Card(faces.Three, sameSuit, true);
            stack.place(card);

            expect(stack.cards.length).toBe(3);
        });

        test('attempt to take bottom card fails', () => {
            expect(stack.take(0)).toBe(null);
        });

        test('attempt to take top card succeeds', () => {
            const cards = stack.take(1);

            expect(stack.cards.length).toBe(1);
            expect(cards.length).toBe(1);
            expect(cards[0].face).toBe(faces.Two);
            expect(cards[0].suit).toBe(sameSuit);
        });
    });

});
