import { WebSocketServer } from 'ws';
import { onConnect } from './src/dispatcher.js';
import { startInspector } from './src/inspector.js';


start();
startInspector();

async function start() {
    let wss = null;

    await new Promise((resolve, reject) => {
        wss = new WebSocketServer({ port: 5000 }, resolve);
        wss.on('error', (error) => {
            console.error('Unable to initialize WebSocket listener');
            console.error(error.message);
            reject(error);
            process.exit(1);
        });
    });

    wss.on('connection', onConnect);

    console.log('Solitaire server started');
    console.log('Listening for clients on port 5000');
}

// connect
// identify -> create Player
// join room -> create Game
// init game (if two players present)
// start round
// main phase