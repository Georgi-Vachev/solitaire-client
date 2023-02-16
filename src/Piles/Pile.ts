import { Card } from "../Card";
import * as PIXI from 'pixi.js'
import { selectedCard } from "../app";

export const CardMovedEvent = "card-moved";

export class Pile {
    public cards: Card[] = [];
    public x: number;
    public y: number;
    public type: string;
    public setCard: (card: Card, source: string) => boolean
    container = new PIXI.Container();
    target: boolean;

    constructor() {
        this.container.interactive = true;
        this.container.on("pointertap", (e) => {
            if (e.target instanceof PIXI.Sprite){
                let cardIndex = this.container.children.indexOf(e.target as any) - 1;
                let card = this.cards[cardIndex];
                if(this.setCard(card, this.type)){
                    this.target = true;
                };
                // card.isSelected = true;
                // card.currentSource = this.type;
                // this.target = true;
            }
        });
    }

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
