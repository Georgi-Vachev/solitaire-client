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
        card.position.set(posX, 200);
        const mask = new PIXI.Graphics();
        mask.beginFill(0);
        mask.drawRoundedRect(card.x, card.y, 85, 130, 10);
        mask.endFill();
        card.mask = mask;
        app.stage.addChild(card)
        if (posX < 600) {
            posX += 100
        } else {
            break;
        }
    }
}

function outlinePiles(x, y) {
    for (let i = x; i <= 650; i += 100) {
        for (let j = y; j <= 220; j += 180) {
            if (i == 250 && j == y) {
                continue;
            } else {
                const pileBorder = new PIXI.Graphics();
                pileBorder.lineStyle(2, 0xFFCC00, 1);
                pileBorder.drawRoundedRect(0, 0, 95, 140, 5);
                pileBorder.endFill();
                pileBorder.position.set(i, j);
                app.stage.addChild(pileBorder);
            }

        }

    }

}
// setMask();
// function setMask(sprite?: PIXI.Sprite){
//     const mask = new PIXI.Graphics();
//     mask.beginFill(0);
//     mask.drawRoundedRect(45, 20, 100, 130, 5);
//     mask.endFill();
//     sprite.mask = mask;
// }
