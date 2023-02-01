import { EventEmitter } from "events";
import { Card } from "../Card";
import * as PIXI from 'pixi.js'

export const CardMovedEvent = "card-moved";

export class Pile {
    public cards: Card[] = [];
    public x: number;
    public y: number;
    container = new PIXI.Container();

    public addCard(card: Card): void {
        this.cards.push(card);
        this.container.addChild(card.sprite)
    }

    public removeCard(card: Card): void {
        const index = this.cards.indexOf(card);
        if (index >= 0) {
            this.cards.splice(index, 1);
        }
        this.container.removeChild(card.sprite)
    }

    public getCards(): Card[] {
        return this.cards;
    }

    public getTopCard(): Card {
        return this.cards[0];
    }

    outline(x: number, y: number) {
        const pileBorder = new PIXI.Graphics();
        pileBorder.lineStyle(2, 0xFFCC00, 1);
        pileBorder.drawRoundedRect(x, y, 95, 140, 5);
        pileBorder.endFill();
        this.container.addChild(pileBorder);
    }
}
