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
    tl = gsap.timeline()

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
        faceUp ? this.activate() : this.deactivate();
        this.attachEvents();
    }

    deactivate() {
        this.faceUp = false;
        this.cardfront.visible = false;
        this.cardback.visible = true;
    }

    activate() {
        this.faceUp = true;
        this.cardfront.visible = true;
        this.cardback.visible = false;
    }

    attachEvents() {
        this.cardback.on('pointertap', () => this.flip());
    }

    private flip() {
        this.tl.to(this.cardback, { pixi: { scaleX: 0, }, duration: .5, onComplete: () => this.activate() });
        this.tl.fromTo(this.cardfront, { pixi: { scaleX: 0 } }, { pixi: { scaleX: 0.2 }, duration: .5 });
    }
}