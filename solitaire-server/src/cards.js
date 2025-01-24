
export const faces = {
    Ace: 1,
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9,
    Ten: 10,
    Jack: 11,
    Queen: 12,
    King: 13,
};
export const suits = {
    Spades: 'spades',
    Hearts: 'hearts',
    Diamonds: 'diamonds',
    Clubs: 'clubs'
};
export const colors = {
    [suits.Spades]: 'black',
    [suits.Hearts]: 'red',
    [suits.Diamonds]: 'red',
    [suits.Clubs]: 'black'
};

export const stacks = {
    Stock: 'stock',
    Waste: 'waste',
    Pile: 'pile',
    Foundation: 'foundation'
};

export class Card {
    /** @type {keyof faces} */
    face;
    /** @type {keyof suits} */
    suit;
    faceUp = false;

    constructor(face, suit, faceUp = false) {
        this.face = face;
        this.suit = suit;
        this.faceUp = faceUp;
    }
}

export class Stack {
    /** @type {Card[]} */
    cards = [];
    /** @type {keyof stacks} */
    type;
    /** @type {keyof suits | null} */
    suit;

    /**
     * 
     * @param {keyof stacks} type 
     * @param {keyof suits | null} suit 
     */
    constructor(type, suit = null) {
        if (type == stacks.Foundation && suit == null) {
            throw new TypeError('Foundation must have a suit');
        }
        this.type = type;
        this.suit = suit;
    }

    /**
     * @returns {Card | undefined}
     */
    get top() {
        return this.cards[this.cards.length - 1];
    }

    /**
     * @returns {number}
     */
    get topIndex() {
        return this.cards.length - 1;
    }

    canFlip() {
        // top card must exist and be face down
        // empty stock can always be flipped
        return (this.cards.length > 0 && this.top.faceUp == false) || (this.type == stacks.Stock && this.cards.length == 0);
    }

    canTake(index) {
        // cannot take from stock (can only flip, which moves card to waste automatically)
        if (this.type == stacks.Stock) {
            return false;
        } else if (this.type == stacks.Pile) {
            // ensure card index is in stack check cards on top of selected card
            // since there should be no state in which cards facing up are out of order, only check if all are facing up
            return index <= this.topIndex && this.cards
                .filter((_, i) => i >= index)
                .every(c => c.faceUp);
        } else {
            // only valid if accessing the top card
            return index == this.cards.length - 1;
        }
    }

    /**
     * 
     * @param {Card | Card[]} cards 
     * @returns {boolean}
     */
    canPlace(cards) {
        if (Array.isArray(cards) == false) {
            cards = [cards];
        }

        // only valid for piles and foundation
        if (this.type == stacks.Pile) {
            // bottom card suit must be of opposite color and card face must be one-less than current top
            // or a king on an empty pile
            const bottom = cards[0];

            if (this.cards.length == 0 && bottom.face == faces.King) {
                return true;
            } else {
                return this.cards.length > 0 && colors[this.top.suit] != colors[bottom.suit] && this.top.face == bottom.face + 1;
            }

        } else if (this.type == stacks.Foundation) {
            // can only place single card of same suit
            if (cards.length > 1 || this.suit != cards[0].suit) {
                return false;
            } else {
                // card has to have face one-greater than current top or an Ace with empty foundation 
                const card = cards[0];

                if (this.cards.length == 0) {
                    return card.face == faces.Ace;
                } else {
                    return this.top.face == card.face - 1;
                }
            }
        } else {
            return false;
        }
    }

    flip() {
        // /!\ stock flipping must automatically take and place card on waste, since you cannot take from the stock and cannot place on the waste
        if (this.canFlip()) {
            this.top.faceUp = true;

            return true;
        } else {
            return false;
        }
    }

    take(index) {
        if (this.canTake(index)) {
            return this.cards.splice(index, this.cards.length - index);
        } else {
            return null;
        }
    }

    /**
     * 
     * @param {Card | Card[]} cards 
     * @returns {boolean}
     */
    place(cards) {
        if (Array.isArray(cards) == false) {
            cards = [cards];
        }
        if (this.canPlace(cards)) {
            this.cards.push(...cards);

            return true;
        } else {
            return false;
        }
    }
}

export class Deck {
    /** @type {Card[]} */
    cards = [];

    constructor() {
        const stock = Object.values(suits).flatMap(suit => Object.values(faces).map(face => new Card(face, suit, false)));
        this.cards.push(...stock);
    }

    shuffle() {
        const stock = [];
        while(this.cards.length > 0) {
            const card = this.cards.splice(Math.random() * this.cards.length | 0, 1);
            stock.push(card[0]);
        }
        this.cards.push(...stock);
    }

    deal() {
        return this.cards.pop();
    }
}