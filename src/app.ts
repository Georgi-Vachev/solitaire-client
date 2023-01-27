import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from 'pixi.js';
import { getSpritesheet } from "./util";

const initForm = document.querySelector('form');
const initSection = document.getElementById('init');
const gameSection = document.getElementById('game');
const app: PIXI.Application = createPixiApp();

let connection = null;

// initForm.addEventListener('submit', async event => {
//     event.preventDefault();
//     const { nickname } = Object.fromEntries(new FormData(event.target as HTMLFormElement));

//     connection = new Connection(nickname as string);
//     await connection.open();
//     engine(connection);
//     showBoard();

//     connection.send('startGame');
// });

// document.getElementById('disconnect').addEventListener('click', () => {
//     connection?.disconnect();
//     showInit();
// });

showBoard();
function showBoard() {
    initSection.style.display = 'none';
    gameSection.style.display = 'block';

    document.body.appendChild(app.view as HTMLCanvasElement);
    populateBoard();
    outlinePiles(50, 15);
}

function showInit() {
    initSection.style.display = 'block';
    gameSection.style.display = 'none';

    document.body.removeChild(app.view as HTMLCanvasElement);
}

function createPixiApp(): PIXI.Application {
    const app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x00a000, antialias: true });

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

async function populateBoard() {
    const spritesheet = await getSpritesheet(PIXI);

    let posX = 55;

    for (let texture in spritesheet.textures) {
        const card = new PIXI.Sprite(spritesheet.textures[texture])
        card.scale.set(0.21)
        card.position.set(posX, 20);
        app.stage.addChild(card)
        if (posX < 600) {
            posX += 100
        } else {
            break;
        }
    }
}

function outlinePiles(x, y) {
    const pileBorder = new PIXI.Graphics();

    pileBorder.lineStyle(2, 0xFFCC00, 1);
    pileBorder.moveTo(5, 0);
    pileBorder.arc(90, 5, 5, -Math.PI / 2, 0);
    pileBorder.lineTo(95, 135);
    pileBorder.arc(90, 135, 5, 0, Math.PI / 2);
    pileBorder.lineTo(5, 140);
    pileBorder.arc(5, 135, 5, Math.PI / 2, Math.PI);
    pileBorder.lineTo(0, 5);
    pileBorder.arc(5, 5, 5, Math.PI, -Math.PI / 2);
    pileBorder.position.set(x, y);
    app.stage.addChild(pileBorder);
}