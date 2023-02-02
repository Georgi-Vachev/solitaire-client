import { Pile, CardMovedEvent } from "./pile";
import { Card } from "../Card";
import { Deck } from "../deck";

export class DrawPile extends Pile {
    public deck: Deck;

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
        for (let i = this.deck.getCards().length - 1; i >= 0; i--) {
            const card = this.deck.cards[i];
            console.log(card)
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

    public addCard(card: Card): void {
        this.cards.push(card);
        this.container.addChild(card.sprite)
    }

    public getTopCard(): Card {
        return this.cards[this.cards.length - 1];
    }
}
