import { WebSocket } from 'ws';
import { connect } from './connection.js';
import { Game } from './Game.js';
import { Player } from './Player.js';


/**
 * @type {{[name: string]: Game}}
 */
export const games = {};


/**
 * 
 * @param {WebSocket} ws 
 */
export async function onConnect(ws) {
    const connection = await connect(ws);
    
    connection.on('startGame', () => {
        if (games[connection.name] == undefined) {
            games[connection.name] = new Game();
        }
        const game = games[connection.name];
        
        const player = new Player(connection); // game will add listeners; player must be remade every time before it's added
        game.addPlayer(player);
    });
}