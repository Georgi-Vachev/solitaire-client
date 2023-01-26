import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from 'pixi.js';

const initForm = document.querySelector('form');
const initSection = document.getElementById('init');
const gameSection = document.getElementById('game');
const app: PIXI.Application = createPixiApp();

let connection = null;

initForm.addEventListener('submit', async event => {
    event.preventDefault();
    const { nickname } = Object.fromEntries(new FormData(event.target as HTMLFormElement));

    connection = new Connection(nickname as string);
    await connection.open();
    engine(connection);
    showBoard();

    connection.send('startGame');
});

document.getElementById('disconnect').addEventListener('click', () => {
    connection?.disconnect();
    showInit();
});

function showBoard() {
    initSection.style.display = 'none';
    gameSection.style.display = 'block';

    document.body.appendChild(app.view as HTMLCanvasElement);
}

function showInit() {
    initSection.style.display = 'block';
    gameSection.style.display = 'none';

    document.body.removeChild(app.view as HTMLCanvasElement);
}

function createPixiApp(): PIXI.Application {
    const app = new PIXI.Application({ width: 700, height: 500, backgroundColor: 0x00a000 });

    (app.view as HTMLCanvasElement).style.position = 'absolute';
    (app.view as HTMLCanvasElement).style.left = '50%';
    (app.view as HTMLCanvasElement).style.top = '50%';
    (app.view as HTMLCanvasElement).style.transform = 'translate3d( -50%, -50%, 0 )';
    (app.view as HTMLCanvasElement).style.borderRadius = '30px';
    (app.view as HTMLCanvasElement).style.border = 'solid 2px #fff';
    (app.view as HTMLCanvasElement).style.boxShadow = '#333 0 0 7px';
    (app.view as HTMLCanvasElement).style.marginTop = '12px';

    return app;
}