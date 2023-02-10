import { Pile } from "./pile";
import { Card } from "../Card";
import { Deck } from "../deck";
import * as PIXI from "pixi.js"

export class DrawPile extends Pile {
    public deck: Deck;
    resetText: PIXI.Text;

    constructor(deck: Deck, x: number, y: number) {
        super();
        this.container.x = x;
        this.container.y = y;
        this.drawResetText();
        this.outline(this.container.x - 7, this.container.y - 10);
        this.deck = deck;
        this.init();
    }

    private init() {
        for (let i = this.deck.getCards().length - 1; i >= 0; i--) {
            const card = this.deck.cards[i];
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

    drawResetText() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 15,
            fill: 0xffffff,
        });
        this.resetText = new PIXI.Text('RESET', style);
        this.resetText.interactive = true;
        this.resetText.position.set(this.container.x + 17, this.container.y + 50)
        this.container.addChild(this.resetText);
    }

    repopulate(wastePile) {
        console.log(wastePile.cards)
    }
}
