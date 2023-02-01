import { Pile } from './pile';
import { Card } from '../Card';
import { WastePile } from './waste-pile';
import * as PIXI from 'pixi.js';
import { populateBoard, wastePile } from '../app';

export class FoundationPile extends Pile {
    private readonly suit: string;

    constructor(suit: string, x: number, y: number) {
        super();
        this.suit = suit;
        this.container.x = x;
        this.container.y = y;
        this.outline(this.container.x - 7, this.container.y - 10);
        this.container.on('pointerup', this.drawFromWastePile.bind(this));
    }

    public addCard(card: Card) {
        if (this.cards.length === 0 && card.rank === 'A') {
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
    public async drawFromWastePile(){
        const card = wastePile.getTopCard();
        if (card != undefined){
            if (card.isDragging){
                wastePile.removeCard(card);
                this.cards.push(card)
                card.sprite.anchor.set(0.5, 0.5);
                card.sprite.position.set(240, 80)
                this.container.addChild(card.sprite);
                let x = 240;
                let y = 70;
                card.isDragging = false;
                for (let i = 1;i < this.container.children.length; i++){
                    const child = this.container.children[i];
                    child.position.set(x, y);
                    y += 5;
                };
                //console.log(`card x: ${card.sprite.x} card y: ${card.sprite.y}`);
                //console.log('containerX:' + this.container.x, 'containerY:' + this.container.y);
                //console.log('containerWidth:' + this.container.width, 'containerHeight' + this.container.height)
            }
        }
        
    }
    private updateChildren(){
        
    }
}

//the FoundationPile class extends the Pile class,
// so it has all of the same methods and properties as
// the Pile class. The FoundationPile class has an additional property, suit,
// which stores the suit of the cards in the pile. The addCard() method has been overridden to only allow cards
// to be added if they have the same suit as the FoundationPile and their rank is one higher than the rank of the top card in the pile.