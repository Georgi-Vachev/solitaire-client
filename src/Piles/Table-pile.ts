import { Card } from '../Card';
import { Pile } from './Pile';
import * as PIXI from 'pixi.js'

export class TablePile extends Pile {
    cards: Card[];
    target: boolean = false;

    constructor(x: number, y: number, type: string) {
        super();
        this.cards = [];
        this.container.x = x;
        this.container.y = y;
        this.type = type;
        this.outline(this.container.x - 7, this.container.y - 10);
        this.container.interactive = true;
        // this.container.on("pointertap", (e) => {
        //     if (e.target instanceof PIXI.Sprite) {
        //         let card = this.cards[this.container.children.indexOf(e.target as any) - 1];
        //         if (this.setCard(card, this.type)) {
        //             this.target = true;
        //         };
        //     }
        // });
    }

    addCard(card: Card) {
        this.cards.push(card);
        this.container.addChild(card.sprite);
        const currentIndex = this.cards.indexOf(card);
        card.updatePosition(this.container.x, this.container.y + currentIndex * 15);
        for (let card of this.cards) {
            card.sprite.interactive = false;
        }
        card.sprite.interactive = true;
    }

    removeCard(card: Card) {
        const index = this.cards.indexOf(card);
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
    }

    get topCard(): Card | undefined {
        return this.cards[this.cards.length - 1];
    }
}

