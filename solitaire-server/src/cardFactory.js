import { Deck, Stack, stacks, suits } from './cards.js';


/**
 * @typedef {Object} GameState
 * @property {Stack} stock,
 * @property {Stack} waste,
 * @property {{[suit: string]: Stack}} foundations,
 * @property {[Stack, Stack, Stack, Stack, Stack, Stack, Stack]} piles,
 */

/**
 * @typedef {Object} Moveset
 * @property {Move} stock,
 * @property {Move} waste,
 * @property {{[suit: string]: Move}} foundations,
 * @property {[Move, Move, Move, Move, Move, Move, Move]} piles,
 */

/**
 * @typedef {Object} Move
 * @property {boolean} flip
 * @property {number[]} take
 * @property {boolean} place
 */

/**
 * 
 * @returns {GameState}
 */
export function createState() {
    return {
        stock: createStock(),
        waste: createWaste(),
        foundations: {
            [suits.Clubs]: createFoundation(suits.Clubs),
            [suits.Diamonds]: createFoundation(suits.Diamonds),
            [suits.Hearts]: createFoundation(suits.Hearts),
            [suits.Spades]: createFoundation(suits.Spades),
        },
        piles: [
            createPile(),
            createPile(),
            createPile(),
            createPile(),
            createPile(),
            createPile(),
            createPile(),
        ]
    };
}

/**
 * 
 * @param {GameState} state
 * @param {Card[]?} cards
 * @returns {Moveset}
 */
export function createMoveset(state, cards) {
    return {
        stock: checkMoves(state.stock, cards),
        waste: checkMoves(state.waste, cards),
        foundations: {
            [suits.Clubs]: checkMoves(state.foundations[suits.Clubs], cards),
            [suits.Diamonds]: checkMoves(state.foundations[suits.Diamonds], cards),
            [suits.Hearts]: checkMoves(state.foundations[suits.Hearts], cards),
            [suits.Spades]: checkMoves(state.foundations[suits.Spades], cards),
        },
        piles: state.piles.map(p => checkMoves(p, cards))
    };
}

/**
 * 
 * @param {Stack} stack
 * @param {Card[]?} cards
 * @returns {Move}
 */
export function checkMoves(stack, cards) {
    return {
        flip: cards == undefined && stack.canFlip(),
        take: stack.cards.map((c,i) => stack.canTake(i) && i).filter(i => i !== false && cards == undefined),
        place: cards != undefined && stack.canPlace(cards)
    };
}

/**
 * 
 * @param {Deck} deck 
 * @param {GameState} state 
 */
export function dealDeckToState(deck, state) {
    for (let pileIndex = 0; pileIndex < 7; pileIndex++) {
        for (let cardIndex = 0; cardIndex <= pileIndex; cardIndex++) {
            state.piles[pileIndex].cards.push(deck.deal());
        }
        state.piles[pileIndex].top.faceUp = true;
    }
    state.stock.cards.push(...deck.cards);
}

/**
 * 
 * @returns {Stack}
 */
function createStock() {
    return new Stack(stacks.Stock);
}

/**
 * 
 * @returns {Stack}
 */
function createWaste() {
    return new Stack(stacks.Waste);
}

/**
 * 
 * @returns {Stack}
 */
function createPile() {
    return new Stack(stacks.Pile);
}

/**
 * 
 * @param {keyof suits} suit 
 * @returns {Stack}
 */
function createFoundation(suit) {
    return new Stack(stacks.Foundation, suit);
}