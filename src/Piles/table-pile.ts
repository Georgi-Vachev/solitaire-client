import { Card } from '../Card';
import { Pile } from './pile';

export class TablePile extends Pile {
    cards: Card[];

    constructor(x: number, y: number) {
        super();
        this.cards = [];
        this.container.x = x;
        this.container.y = y;
        this.outline(this.container.x - 7, this.container.y - 10);
    }

    addCard(card: Card) {
        this.cards.push(card);
    }

    removeCard(card: Card) {
        const index = this.cards.indexOf(card);
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
    }

    get topCard(): Card | undefined {
        return this.cards[this.cards.length - 1];
    }
}

//the TablePile class has an array cards of type Card,
//which will store the cards that are added to the table pile.
//The class has methods for adding and removing cards, as well as a getter for the top card in the pile.