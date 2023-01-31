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
        this.container.on('pointertap', this.onClickChecker.bind(this));
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
    private fill() {
        let x = 47.5;
        let y = 70
        for (let card of this.deck) {
            card.cardback.position.set(this.container.pivot.x, this.container.pivot.y);
            card.cardfront.position.set(this.container.pivot.x, this.container.pivot.y);
            this.container.addChild(card.cardfront, card.cardback);
            card.cardback.position.set(x, y);
            card.cardfront.position.set(x, y);
            const mask = new PIXI.Graphics();
            mask.beginFill()
            mask.drawRoundedRect(this.container.x - 40, this.container.y - 60, 80, 120, 6);
            mask.endFill();
            card.cardfront.mask = mask;
            card.cardback.mask = mask;
            x += 0.1;
            y -= 0.1;
        }
    }
    private onClickChecker() {
        const cardOnTopBack = this.container.getChildAt(this.container.children.length - 1);
        const cardOnTopFront = this.container.getChildAt(this.container.children.length - 2);

        
        const cardBelowBack = this.container.getChildAt(this.container.children.length - 3);
        const cardBelowFront = this.container.getChildAt(this.container.children.length - 4);
        
        this.container.swapChildren(this.container.getChildAt(1), cardOnTopFront);
        this.container.swapChildren(this.container.getChildAt(2), cardOnTopBack);

        this.container.children.pop();
        this.container.children.pop();
        

    }
    private reset() {
        //TODO
    }
}
