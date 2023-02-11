import { Pile } from "./Pile";
import { Card } from "../Card";
import { Deck } from "../Deck";
import * as PIXI from "pixi.js"

export class DrawPile extends Pile {
    public deck: Deck;
    public repopulated: boolean = false;
    resetText: PIXI.Text;

    constructor(deck: Deck, x: number, y: number) {
        super();
        this.container.x = x;
        this.container.y = y;
        this.drawResetText();
        this.type = 'stock';
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
        this.repopulated = true;
        for (let i = wastePile.cards.length; i > 0; i--) {
            const card = wastePile.getTopCard();
            wastePile.removeCard(card);
            card.turnFaceDown();
            card.flipped = false;
            this.addCard(card);
            card.updatePosition(this.container.x, this.container.y);
        }
        console.log(wastePile.cards.length, this.cards.length)
    }
}
