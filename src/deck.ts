import { Card } from "./Card";
import * as PIXI from 'pixi.js'

export class Deck {
    cards: Card[];
    private currentCardIndex: number;

    constructor(cardTextures: any, backTexture: PIXI.Texture) {
        this.cards = [];
        this.currentCardIndex = 0;

        for (const texture in cardTextures.textures) {
            const card = new Card(texture, cardTextures.textures[texture], backTexture);
            this.cards.push(card);
        }
    }

    public drawCard(): Card {
        if (this.currentCardIndex >= this.cards.length) {
            return null;
        }
        return this.cards[this.currentCardIndex++];
    }

    public getCards(): Card[] {
        return this.cards;
    }

    // public shuffle(): void {
    //     for (let i = this.cards.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    //     }
    // }
    removeCard(card: Card) {
        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
        }
    }
}
