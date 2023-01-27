import * as PIXI from 'pixi.js'
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card {

    x: number;
    y: number;
    cardfront: PIXI.Sprite;
    mask: PIXI.Graphics;
    rank: string;
    suit: string;
    faceUp: boolean;
    cardback: PIXI.Sprite;
    activeSprite: PIXI.Sprite;
    tl = gsap.timeline()

    constructor(x: number, y: number, cardfront: PIXI.Sprite, name: string, mask: PIXI.Graphics, faceUp: boolean, cardback: PIXI.Sprite) {
        this.x = x;
        this.y = y;
        this.cardfront = cardfront;
        this.cardfront.interactive = true;
        this.cardback = cardback;
        this.cardback.interactive = true;
        this.rank = name.split('')[1];
        this.suit = name.split('')[0];
        this.mask = mask;
        this.faceUp = faceUp;
        this.activeSprite = faceUp ? cardfront : cardback;
        this.onClick();
    }

    deactivate() {
        console.log('deactivated')
        this.faceUp = false;
        this.activeSprite = this.cardback;
    }

    activate() {
        this.faceUp = true;
        this.activeSprite = this.cardfront;
        console.log(this.activeSprite)
    }

    onClick() {
        this.activeSprite.on('pointertap', () => {
            this.tl.to(this.activeSprite, { pixi: { skewY: 90, }, duration: 1, onComplete: () => this.activate() });
            this.tl.set(this.activeSprite, { pixi: { skewY: -90 } })
            this.tl.to(this.activeSprite, { pixi: { skewY: 0 }, duration: 1 });
        })
    }
}