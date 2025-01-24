import { Connection } from './connection.js';


export class Player {
    /** @type {Connection} */
    connection = null;

    constructor(connection) {
        this.connection = connection;
        this._initEventListeners();
    }

    _initEventListeners() {
        this.connection.on('newGame', () => {
            console.log('new game');
            this.onNewGame();
        });
        this.connection.on('move', data => {
            console.log('move', data);
            this.onMove(data);
        });
        this.connection.on('getState', data => {
            console.log('refreshing state', data);
            this.onGetState();
        });
    }

    onNewGame() {
        // Placeholder to be registered from outside
    }

    onMove(move) {
        // Placeholder to be registered from outside
    }

    onGetState() {
        // Placeholder to be registered from outside
    }

    setGameState(state) {
        this.connection.send('state', state);
    }

    setValidMoves(moves) {
        this.connection.send('moves', moves);
    }

    moveResult(result) {
        this.connection.send('moveResult', result);
    }

    victory() {
        this.connection.send('victory');
    }
}