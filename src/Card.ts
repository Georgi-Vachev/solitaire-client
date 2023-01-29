import * as PIXI from 'pixi.js'
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card {

    x: number;
    y: number;
    cardfront: PIXI.Sprite;
    cardback: PIXI.Sprite;
    rank: string;
    suit: string;
    faceUp: boolean;
    tl = gsap.timeline();

    constructor(x: number, y: number, cardfront: PIXI.Sprite, cardback: PIXI.Sprite, name: string, faceUp: boolean) {
        this.x = x;
        this.y = y;
        this.cardfront = cardfront;
        this.cardfront.interactive = true;
        this.cardback = cardback;
        this.cardback.interactive = true;
        this.rank = name.split('')[1];
        this.suit = name.split('')[0];
        this.faceUp = faceUp;
        this.attachEvents();
    }

    attachEvents() {
        this.cardback.on('pointertap', () => this.flip());
    }

    private flip() {
        this.faceUp = true;
        this.tl.to([this.cardback, this.cardfront], { pixi: { x: '+=50' } })
        this.tl.to(this.cardback, { pixi: { scaleX: 0, x: '+=50' }, duration: .3, onUpdate: this.updateCardbackMask.bind(this) }, '<');
        this.tl.fromTo(this.cardfront, { pixi: { scaleX: 0, x: '+=50' } }, { pixi: { scaleX: 0.2, x: '+=50', onUpdate: this.updateCardfrontMask.bind(this) }, duration: 1 });
    }

    updateCardbackMask() {
        const mask = new PIXI.Graphics();
        mask.beginFill()
        mask.drawRoundedRect(this.cardback.x + 10.5, this.cardback.y - 45, 80, 120, 6);
        mask.endFill();
        this.cardback.mask = mask;
    }

    updateCardfrontMask() {
        const mask = new PIXI.Graphics();
        mask.beginFill()
        mask.drawRoundedRect(this.cardfront.x + 60.5, this.cardfront.y - 45, 80, 120, 6);
        mask.endFill();
        this.cardfront.mask = mask;
    }
}