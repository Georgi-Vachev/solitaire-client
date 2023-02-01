import * as PIXI from 'pixi.js'
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";
import { WastePile } from './Piles/waste-pile';
import { DrawPile } from './Piles/draw-pile';


gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card {
    rank: string;
    suit: string;
    sprite: PIXI.Sprite;
    frontTexture: PIXI.Texture;
    backTexture: PIXI.Texture;
    private dragStartPosition: PIXI.Point;
    private isDragging: boolean;
    private isFaceUp: boolean;
    x: number;
    y: number;
    tl: gsap.core.Timeline;

    constructor(name: string, frontTexture: PIXI.Texture, backTexture: PIXI.Texture) {
        this.rank = name.split('')[1];
        this.suit = name.split('')[0];
        this.frontTexture = frontTexture;
        this.backTexture = backTexture;
        this.isFaceUp = false;
        this.sprite = new PIXI.Sprite(backTexture);
        this.sprite.anchor.set(.5)
        this.sprite.width = 80;
        this.sprite.height = 120;
        this.sprite.interactive = true;
        this.x = 0;
        this.y = 0;
        this.isDragging = false;
        this.dragStartPosition = new PIXI.Point();
        this.tl = gsap.timeline();
        this.sprite.on("pointerdown", this.onPointerDown.bind(this));
        this.sprite.on("pointerup", this.onPointerUp.bind(this));
        this.sprite.on("pointerupoutside", this.onPointerUp.bind(this));
        this.sprite.on("pointermove", this.onPointerMove.bind(this));
    }

    private onPointerDown(event): void {
        this.dragStartPosition.x = event.data.global.x - this.sprite.x;
        this.dragStartPosition.y = event.data.global.y - this.sprite.y;
        this.isDragging = true;
    }

    private onPointerUp(event): void {
        this.isDragging = false;
        this.sprite.position.set(event.data.global.x - this.dragStartPosition.x,
            event.data.global.y - this.dragStartPosition.y
        )
    }

    private onPointerMove(event): void {
        if (this.isDragging) {
            this.sprite.position.set(event.data.global.x - this.dragStartPosition.x,
                event.data.global.y - this.dragStartPosition.y
            )
        }
    }

    updatePosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.sprite.position.set(x + 40, y + 60)
    }

    public getX(): number {
        return this.x;
    }

    public setX(x: number): void {
        this.x = x;
        this.sprite.x = x;
    }

    public getY(): number {
        return this.y;
    }

    public setY(y: number): void {
        this.y = y;
        this.sprite.y = y;
    }

    public flip(drawPile: DrawPile, wastePile: WastePile): void {

        this.tl.to(this.sprite, {
            pixi: { skewY: 90, x: '+=60' }, duration: 0.5, onComplete: () => {
                this.turnFaceUp();
            }
        })

        this.tl.to(this.sprite, {
            pixi: { skewY: 0, x: '+=60' }, duration: 0.5, onComplete: () => {
                wastePile.drawFromDrawPile(drawPile);
            }
        })

    }

    isFacingUp(): boolean {
        return this.isFaceUp;
    }
    isFaceDown(): boolean {
        return !this.isFaceUp;
    }
    turnFaceUp() {
        this.isFaceUp = true;
        this.sprite.texture = this.isFaceUp ? this.frontTexture : this.backTexture;
    }

    turnFaceDown() {
        this.isFaceUp = false;
    }

}
