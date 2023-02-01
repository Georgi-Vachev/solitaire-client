import { Pile, CardMovedEvent } from "./pile";
import { Card } from "../Card";
import { Deck } from "../deck";

export class DrawPile extends Pile {
    private deck: Deck;

    constructor(deck: Deck, x: number, y: number) {
        super();
        this.deck = deck;
        this.container.x = x;
        this.container.y = y;
        this.init();
        this.outline(this.container.x - 7, this.container.y - 10);
    }

    private init() {
        this.deck.shuffle();
        for (const card of this.deck.getCards()) {
            card.turnFaceDown();
            card.updatePosition(this.container.x, this.container.y);
            this.addCard(card);
        }
    }

    public drawCard(): Card {
        const card = this.deck.drawCard();
        if (card) {
            this.removeCard(card);
        }
        return card;
    }
}
