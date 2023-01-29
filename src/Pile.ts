import * as PIXI from 'pixi.js'
import { TCard } from './util';
import { gsap } from 'gsap';
import { Card } from './Card';

export class StockPile {
    public deck: TCard[];
    private app: PIXI.Application;
    public container: PIXI.Container;
    private x: number;
    private y: number;

    constructor(deck: TCard[], app: PIXI.Application, x: number, y: number) {
        this.deck = deck;
        this.app = app;
        this.x = x;
        this.y = y;
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.app.stage.addChild(this.container);
        this.drawPile();
        this.fill();
    }

    private drawPile() {
        const pileBorder = new PIXI.Graphics();
        pileBorder.lineStyle(2, 0xFFCC00, 1);
        pileBorder.drawRoundedRect(0, 0, 95, 140, 5);
        pileBorder.endFill();
        this.container.position.set(this.x, this.y);
        this.container.pivot.set(47.5, 70)
        this.container.addChild(pileBorder);
    }
    public fill() {
        for (let card of this.deck) {
            card.cardback.position.set(47.5, 70);
            card.cardfront.position.set(47.5, 70);
            const mask = new PIXI.Graphics();
            mask.beginFill()
            mask.drawRoundedRect(card.cardback.x + 10.5, card.cardback.y - 45, 80, 1000, 6);
            mask.endFill();
            card.cardfront.mask = mask;
            card.cardback.mask = mask;
            this.container.addChild(card.cardfront, card.cardback);
        }
    }

}
