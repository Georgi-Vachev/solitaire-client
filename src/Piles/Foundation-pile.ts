import { Pile } from './Pile';
import { Card } from '../Card';

export class FoundationPile extends Pile {
    private readonly suit: string;
    target: boolean = false;

    constructor(suit: string, x: number, y: number) {
        super();
        this.suit = suit;
        this.container.x = x;
        this.container.y = y;
        this.type = 'foundation';
        this.outline(this.container.x - 7, this.container.y - 10);
    }

    public addCard(card: Card) {
        if (this.cards.length === 0 && card.rank === 1) {
            this.container.addChild(card.sprite);
            return super.addCard(card);
        } else if (this.cards.length > 0 && card.suit === this.suit &&
            card.rank === this.getTopCard().rank + 1) {
            this.container.addChild(card.sprite);
            return super.addCard(card);
        } else {
            return false;
        }
    }
    // public async drawFromWastePile() {
    //     const card = wastePile.getTopCard();
    //     if (card != undefined) {
    //         if (card.isDragging) {
    //             wastePile.removeCard(card);
    //             this.cards.push(card)
    //             card.sprite.anchor.set(0.5, 0.5);
    //             card.sprite.position.set(240, 80)
    //             this.container.addChild(card.sprite);
    //             card.isDragging = false;
    //             for (let i = 1; i < this.container.children.length; i++) {
    //                 const child = this.container.children[i];
    //                 child.position.set(this.container.x + 40, this.container.y + 60);
    //             };
    //         }
    //     }

    // }
    private updateChildren() {

    }
}
