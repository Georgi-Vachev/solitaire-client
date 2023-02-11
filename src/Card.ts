import * as PIXI from 'pixi.js'
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";
import { WastePile } from './Piles/Waste-pile';
import { DrawPile } from './Piles/Draw-pile';
import { Draggable } from 'gsap/Draggable'
import { FederatedPointerEvent } from 'pixi.js';
import { foundationPiles } from './app';
import { connection } from './app';
gsap.registerPlugin(Draggable);
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class Card {
    rank: number;
    suit: string;
    sprite: PIXI.Sprite;
    frontTexture: PIXI.Texture;
    backTexture: PIXI.Texture;
    isDragging: boolean;
    currentContainerIndex: number;
    x: number;
    y: number;
    tl: gsap.core.Timeline;
    pileIndex: number;
    private dragStartPosition: PIXI.Point;
    private flipped: boolean = false;
    private isFaceUp: boolean;

    constructor(backTexture: PIXI.Texture) {
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
    }

    private onPointerDown(event: FederatedPointerEvent): void {
        if (this.isFaceUp) {
            this.dragStartPosition.x = event.data.global.x - this.sprite.x;
            this.dragStartPosition.y = event.data.global.y - this.sprite.y;
            this.isDragging = true;
            this.currentContainerIndex = this.sprite.parent.parent.children.indexOf(this.sprite.parent);
            this.pileIndex = this.sprite.parent.children.length - 2
            let currentSource;
            switch (this.currentContainerIndex) {
                case 1:
                    currentSource = 'stock'
                    break;
                case 6:
                    currentSource = 'pile0'
                    break;
                case 7:
                    currentSource = 'pile1'
                    break;
                case 8:
                    currentSource = 'pile2'
                    break;
                case 9:
                    currentSource = 'pile3'
                    break;
                case 10:
                    currentSource = 'pile4'
                    break;
                case 11:
                    currentSource = 'pile5'
                    break;
                case 12:
                    currentSource = 'pile6'
                    break;
                default:
                    break;
            }

            connection.send('move', {
                action: 'take',
                source: currentSource,
                target: null,
                index: this.pileIndex
            })
        }
    }

    private onPointerUp(event: FederatedPointerEvent): void {
        if (this.isFaceUp) {
            this.isDragging = false;
            if ([1, 2, 3, 4, 5].includes(this.currentContainerIndex)) {
                this.updatePosition(this.sprite.parent.x, this.sprite.parent.y)
            } else if ([6, 7, 8, 9, 10, 11, 12].includes(this.currentContainerIndex)) {
                const currentIndex = this.sprite.parent.children.indexOf(this.sprite);
                this.updatePosition(this.sprite.parent.x, this.sprite.parent.y + (currentIndex - 1) * 15);
            }
        }
    }

    private onPointerMove(event: FederatedPointerEvent): void {
        if (this.isFaceUp) {
            if (this.isDragging) {
                this.sprite.position.set(event.data.global.x - this.dragStartPosition.x,
                    event.data.global.y - this.dragStartPosition.y
                )
            }
        }
    }

    reveal(info: { face: number, suit: string, faceUp: boolean }, frontTexture: PIXI.Texture) {
        this.frontTexture = frontTexture
        this.rank = info.face;
        this.suit = info.suit;
        this.turnFaceUp();
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
        if (!this.flipped) {
            this.flipped = true;
            this.tl.to(this.sprite, {
                pixi: { skewY: 45, x: '+=60' }, duration: 0.25, onComplete: () => {
                    this.turnFaceUp();
                }
            })

            this.tl.to(this.sprite, {
                pixi: { skewY: 0, x: '+=60' }, duration: 0.25, onComplete: () => {
                    wastePile.drawFromDrawPile(drawPile, this);
                }
            })
        }
    }

    public flipOnTablePile(): void {

        this.tl.to(this.sprite, {
            pixi: { scaleX: 0 }, duration: 0.5, onComplete: () => {
                this.turnFaceUp();
            }
        })
        this.tl.to(this.sprite, {
            pixi: { scaleX: 0.2 }, duration: 0.5
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
        this.sprite.on("pointerdown", this.onPointerDown.bind(this));
        this.sprite.on("pointerup", this.onPointerUp.bind(this));
        this.sprite.on("pointerupoutside", this.onPointerUp.bind(this));
        this.sprite.on("pointermove", this.onPointerMove.bind(this));
    }

    turnFaceDown() {
        this.isFaceUp = false;
        this.sprite.texture = this.isFaceUp ? this.frontTexture : this.backTexture;
    }

}
