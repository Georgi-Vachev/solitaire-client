import { Pile } from './pile';
import { Card } from '../Card';
import { DrawPile } from './draw-pile';

export class WastePile extends Pile {
    constructor(x: number, y: number) {
        super();
        this.container.x = x;
        this.container.y = y;
        this.outline(this.container.x - 7, this.container.y - 10);
    }

    public drawFromDrawPile(drawPile: DrawPile): Card {

        let drawnCard: Card = drawPile.drawCard();
        this.addCard(drawnCard);
        drawnCard.turnFaceUp();
        drawnCard.updatePosition(this.container.x, this.container.y)
        return drawnCard;
    }

    public getTopCard(): Card {
        return this.cards[this.cards.length - 1];
    }

}

//the WastePile class extends the Pile class, so it has all of the same methods and properties as the Pile class.
// The WastePile class also has a drawFromDrawPile() method that takes a DrawPile object as an argument and uses it to draw a card.
// The drawn card is then added to the WastePile and turned face up.