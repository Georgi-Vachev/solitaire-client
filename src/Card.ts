import * as PIXI from 'pixi.js'
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";
import { app } from './app';


gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card {

    cardfront: PIXI.Sprite;
    cardback: PIXI.Sprite;
    rank: string;
    suit: string;
    faceUp: boolean;
    tl = gsap.timeline();

    constructor(cardfront: PIXI.Sprite, cardback: PIXI.Sprite, name: string, faceUp: boolean) {
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

    flip() {
        this.faceUp = true;
        this.tl.to([this.cardback, this.cardfront], { pixi: { x: '+=50' } })
        this.tl.to(this.cardback, { pixi: { scaleX: 0, x: '+=50' }, duration: .35, onUpdate: this.updateCardbackMask.bind(this) }, '<');
        this.tl.fromTo(this.cardfront, { pixi: { scaleX: 0, x: '+=50' } }, { pixi: { scaleX: 0.2, x: '+=50' }, duration: 0.35, onUpdate: this.updateCardfrontMask.bind(this) });
    }

    updateCardbackMask() {
        const mask = new PIXI.Graphics();
        mask.beginFill()
        mask.drawRoundedRect(this.cardback.parent.x - 40, this.cardback.parent.y - 60, 80, 120, 7.5);
        mask.endFill();
        this.cardback.mask = mask;
    }

    updateCardfrontMask() {
        const mask = new PIXI.Graphics();
        mask.beginFill()
        mask.drawRoundedRect(this.cardfront.parent.x + 65, this.cardfront.parent.y - 65, 82, 120, 7.5);
        mask.endFill();
        this.cardfront.mask = mask;
    }

}

/**
 * TODO: Create draggin animation of cards that have a faceUp value of 'true'
 */