import { createMoveset, createState, dealDeckToState } from './cardFactory.js';
import { Deck, suits } from './cards.js';
import { Player } from './Player.js';


export class Game {
    /** @type {Player} */
    player = null;
    /** @type {import('./cardFactory.js').GameState} */
    state = null;

    /**
     * 
     * @param {Player} player 
     */
    addPlayer(player) {
        this.player = player;

        this.player.onNewGame = this.newGame.bind(this);
        this.player.onMove = this.move.bind(this);
        this.player.onGetState = this.startGame.bind(this);

        // if game is ongoing, send current state, else make a new state
        if (this.state == null) {
            this.newGame();
        } else {
            this.startGame();
        }
    }

    initGame() {
        const deck = new Deck();
        deck.shuffle();
        deck.shuffle();
        deck.shuffle();
        deck.shuffle();
        deck.shuffle();
        this.state = createState();
        dealDeckToState(deck, this.state);
    }

    startGame() {
        this.player.setGameState(this.obfuscatedState());
        this.player.setValidMoves(this.calcMoves());
    }

    newGame() {
        this.initGame();
        this.startGame();
    }

    move(data) {
        switch (data.action) {
            case 'flip':
                this.flip(data.source);
                break;
            case 'take':
                this.take(data);
                break;
            case 'place':
                this.place(data);
                break;
        }
        if (Object.values(this.state.foundations).every(f => f.cards.length == 13)) {
            this.player.victory();
        }
    }

    flip(source) {
        let result = null;

        if (source == 'stock') {
            if (this.state.stock.cards.length > 0) {
                this.state.stock.flip();
                this.state.waste.cards.push(this.state.stock.cards.pop());
                result = this.state.waste.top;
            } else {
                this.state.waste.cards.reverse();
                this.state.stock.cards.push(...this.state.waste.cards);
                this.state.stock.cards.forEach(c => c.faceUp = false);
                this.state.waste.cards.length = 0;
            }
        } else if (source.includes('pile')) {
            const pileIndex = Number(source[4]);
            if (this.state.piles[pileIndex].flip()) {
                result = this.state.piles[pileIndex].top;
            }
        }

        this.player.moveResult(result);
        this.player.setValidMoves(this.calcMoves());
    }

    take(data) {
        let sourceDeck = null;

        if (data.source == 'stock') {
            sourceDeck = this.state.waste;
        } else if (data.source.includes('pile')) {
            const pileIndex = Number(data.source[4]);
            sourceDeck = this.state.piles[pileIndex];
        } else if (Object.keys(this.state.foundations).includes(data.source)) {
            sourceDeck = this.state.foundations[data.source];
        }

        if (sourceDeck.canTake(data.index)) {
            const cards = sourceDeck.cards.slice(data.index);
            console.log('taking cards', cards);
            this.player.moveResult(true);
            this.player.setValidMoves(this.calcMoves(cards));
        } else {
            this.player.moveResult(false);
        }
    }

    place(data) {
        let sourceDeck = null;

        if (data.source == 'stock') {
            sourceDeck = this.state.waste;
        } else if (data.source.includes('pile')) {
            const pileIndex = Number(data.source[4]);
            sourceDeck = this.state.piles[pileIndex];
        } else if (Object.keys(this.state.foundations).includes(data.source)) {
            sourceDeck = this.state.foundations[data.source];
        }

        let targetDeck = null;

        if (data.target.includes('pile')) {
            const pileIndex = Number(data.target[4]);
            targetDeck = this.state.piles[pileIndex];
        } else if (Object.values(suits).includes(data.target)) {
            targetDeck = this.state.foundations[data.target];
        }

        if (sourceDeck.canTake(data.index) && targetDeck.canPlace(sourceDeck.cards.slice(data.index))) {
            const cards = sourceDeck.take(data.index);
            console.log('placing cards cards', cards);
            targetDeck.place(cards);

            this.player.moveResult(true);
            this.player.setValidMoves(this.calcMoves());
        } else {
            this.player.moveResult(false);
        }
    }

    calcMoves(cards) {
        const moves = createMoveset(this.state, cards);
        return moves;
    }

    obfuscatedState() {
        const result = JSON.parse(JSON.stringify(this.state));
        deepObfuscate(result);
        return result;
    }
}


function deepObfuscate(level) {
    if (Array.isArray(level)) {
        level.forEach(deepObfuscate);
    } else if (typeof level == 'object' && level != null) {
        if (level.faceUp === false) {
            level.face = null;
            level.suit = null;
        } else {
            Object.values(level).forEach(deepObfuscate);
        }
    }
}