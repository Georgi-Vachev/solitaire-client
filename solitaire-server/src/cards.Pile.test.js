import { jest, expect, test, describe, beforeEach } from '@jest/globals';
import { Card, Stack, stacks, faces, suits } from './cards.js';


describe('Pile', () => {
    /** @type {Stack} */
    let stack = null;

    beforeEach(() => {
        stack = new Stack(stacks.Pile);
    });

    describe('Empty', () => {

        test('cannot flip', () => {
            expect(stack.canFlip()).toBeFalsy();
        });

        test('cannot take', () => {
            expect(stack.canTake(0)).toBeFalsy();
        });

        test('cannot place less than King', () => {
            const card = new Card(faces.Two, suits.Clubs);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('can place King', () => {
            const card = new Card(faces.King, suits.Clubs);
            expect(stack.canPlace(card)).toBeTruthy();
        });

        test('attempt to place wrong card fails', () => {
            const card = new Card(faces.Ace, suits.Clubs, true);
            stack.place(card);

            expect(stack.cards.length).toBe(0);
        });

        test('attempt to place correct card succeeds', () => {
            const card = new Card(faces.King, suits.Clubs, true);
            stack.place(card);

            expect(stack.cards.length).toBe(1);
        });

        test('attempt to take card fails', () => {
            expect(stack.take(0)).toBe(null);
        });
    });

    describe('Two face-down cards on stack', () => {
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

        test('attempt to flip succeeds', () => {
            stack.flip();
            expect(stack.top.faceUp).toBeTruthy();
        });
    });

    describe('One face-down and one face-up', () => {
        beforeEach(() => {
            stack.cards.push(new Card(faces.Jack, suits.Clubs, false));
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

        test('cannot place two-less than top', () => {
            const card = new Card(faces.Two, suits.Clubs, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('cannot place same as top', () => {
            const card = new Card(faces.Four, suits.Clubs, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('cannot place greater than top', () => {
            const card = new Card(faces.Five, suits.Clubs, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });

        test('cannot place wrong suit', () => {
            const card = new Card(faces.Three, suits.Hearts, true);
            expect(stack.canPlace(card)).toBeFalsy();
        });
        
        test('can place one-less than top', () => {
            const card = new Card(faces.Three, suits.Clubs, true);
            expect(stack.canPlace(card)).toBeTruthy();
        });

        test('attempt to flip fails', () => {
            expect(stack.flip()).toBeFalsy();
            expect(stack.top.faceUp).toBeTruthy();
        });

        test('attempt to place multiple cards', () => {
            const cards = [
                new Card(faces.Three, suits.Clubs, true),
                new Card(faces.Two, suits.Hearts, true)
            ];

            stack.place(cards);
            expect(stack.cards.length).toBe(4);
            expect(stack.cards[2].face).toBe(faces.Three);
            expect(stack.cards[3].face).toBe(faces.Two);
        });
    });
});