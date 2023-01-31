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
    private dragStartPosition: PIXI.Point;
    private isDragging: boolean;
    tl = gsap.timeline();

    constructor(cardfront: PIXI.Sprite, cardback: PIXI.Sprite, name: string, faceUp: boolean) {
        this.cardfront = cardfront;
        this.cardfront.interactive = true;
        this.cardback = cardback;
        this.cardback.interactive = true;
        this.rank = name.split('')[1];
        this.suit = name.split('')[0];
        this.faceUp = faceUp;
        this.isDragging = false;
        this.dragStartPosition = new PIXI.Point();
        this.attachEvents();

        this.cardfront.on("pointerdown", this.onPointerDown.bind(this));
        this.cardfront.on("pointerup", this.onPointerUp.bind(this));
        this.cardfront.on("pointerupoutside", this.onPointerUp.bind(this));
        this.cardfront.on("pointermove", this.onPointerMove.bind(this));
        this.cardback.on('pointertap', () => this.flip.bind(this));
    }



    private onPointerDown(event): void {
        this.dragStartPosition.x = event.data.global.x - this.cardfront.x;
        this.dragStartPosition.y = event.data.global.y - this.cardfront.y;
        this.isDragging = true;
    }

    private onPointerUp(event): void {
        this.isDragging = false;
        this.cardfront.x = event.data.global.x - this.dragStartPosition.x;
        this.cardfront.y = event.data.global.y - this.dragStartPosition.y;
        console.log()
    }

    private onPointerMove(event): void {
        if (this.isDragging) {
            this.cardfront.x = event.data.global.x - this.dragStartPosition.x;
            this.cardfront.y = event.data.global.y - this.dragStartPosition.y;
            console.log(this.cardfront.x, this.cardfront.y)
        }
    }

    attachEvents() {
        this.cardback.on('pointertap', () => this.flip());
    }

    flip() {
        this.tl.to([this.cardback, this.cardfront], { pixi: { x: '+=100' }, duration: 0.3 });
        this.tl.to(this.cardback, { pixi: { skewY: 90 }, duration: 0.3 });
        this.tl.fromTo(this.cardfront, { pixi: { skewY: -90 } }, { pixi: { skewY: 0 }, duration: 0.3 }, '>-0.015')
    }
    updateCardbackMask() {
        const mask = new PIXI.Graphics();
        mask.beginFill()
        mask.drawRoundedRect(this.cardback.parent.x - 34, this.cardback.parent.y - 64, 80, 120, 6);
        mask.drawRoundedRect(this.cardback.parent.x - 40, this.cardback.parent.y - 60, 80, 120, 7.5);
        mask.endFill();
        this.cardback.mask = mask;
    }

    updateCardfrontMask() {
        const mask = new PIXI.Graphics();
        mask.beginFill()
        mask.drawRoundedRect(this.cardfront.x - 2.5, this.cardfront.y - 30, 80, 120, 7.5);
        mask.endFill();
        app.stage.addChild(mask);
        this.cardfront.mask = mask;
    }

}

/**
 * TODO: Create draggin animation of cards that have a faceUp value of 'true'
 */