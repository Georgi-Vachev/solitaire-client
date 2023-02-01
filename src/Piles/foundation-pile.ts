import { Pile } from './pile';
import { Card } from '../Card';

export class FoundationPile extends Pile {
    private readonly suit: string;

    constructor(suit: string, x: number, y: number) {
        super();
        this.suit = suit;
        this.container.x = x;
        this.container.y = y;
        this.outline(this.container.x - 7, this.container.y - 10);
    }

    public addCard(card: Card) {
        if (this.cards.length === 0 && card.rank === 'A') {
            return super.addCard(card);
        } else if (this.cards.length > 0 && card.suit === this.suit &&
            card.rank === this.getTopCard().rank + 1) {
            return super.addCard(card);
        } else {
            return false;
        }
    }
}

//the FoundationPile class extends the Pile class,
// so it has all of the same methods and properties as
// the Pile class. The FoundationPile class has an additional property, suit,
// which stores the suit of the cards in the pile. The addCard() method has been overridden to only allow cards
// to be added if they have the same suit as the FoundationPile and their rank is one higher than the rank of the top card in the pile.