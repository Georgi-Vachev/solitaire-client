import { Pile } from './Pile';
import { Card } from '../Card';
import { DrawPile } from './Draw-pile';

export class WastePile extends Pile {
    constructor(x: number, y: number) {
        super();
        this.container.x = x;
        this.container.y = y;
        this.outline(this.container.x - 7, this.container.y - 10);
    }

    public drawFromDrawPile(drawPile: DrawPile, card: Card): Card {
        drawPile.removeCard(card);
        this.addCard(card);
        card.updatePosition(this.container.x, this.container.y)
        return card;
    }

    public getTopCard(): Card {
        return this.cards[this.cards.length - 1];
    }

}

