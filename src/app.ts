import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from 'pixi.js';
import { initBundles } from "./util";
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";
import { Card } from "./Card";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const initForm = document.querySelector('form');
const initSection = document.getElementById('init');
const gameSection = document.getElementById('game');
const app: PIXI.Application = createPixiApp();

const bundles = (async () => await initBundles())();

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

function showInit() {
    initSection.style.display = 'block';
    gameSection.style.display = 'none';

    document.body.removeChild(app.view as HTMLCanvasElement);
}

async function showBoard() {
    initSection.style.display = 'none';
    gameSection.style.display = 'block';

    document.getElementById('board').appendChild(app.view as HTMLCanvasElement);

    populateBoard();
    outlinePiles(50, 15);
}

function createPixiApp(): PIXI.Application {
    const app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x00a000, antialias: true });

    (app.view as HTMLCanvasElement).style.borderRadius = '30px';
    (app.view as HTMLCanvasElement).style.border = 'solid 2px #fff';
    (app.view as HTMLCanvasElement).style.boxShadow = '#333 0 0 7px';
    (app.view as HTMLCanvasElement).style.margin = 'auto 0';

    return app;
}

async function populateBoard() {
    const boardAssets = (await bundles).getBoardAssets();
    const spritesheetAsset = (await boardAssets).spritesheet;
    const cardbackAsset = (await boardAssets).cardback;

    console.log(spritesheetAsset, cardbackAsset)

    let posX = 97.5;

    for (let texture in spritesheetAsset.textures) {
        const cardfront = new PIXI.Sprite(spritesheetAsset.textures[texture])
        const cardback = new PIXI.Sprite(cardbackAsset);
        console.log(cardback)
        cardfront.anchor.set(0.5);
        cardback.anchor.set(0.5);
        cardfront.position.set(posX, 265);
        cardback.position.set(posX, 265);
        cardfront.width = 80;
        cardfront.height = 120;
        cardback.width = 80;
        cardback.height = 120;
        const mask = new PIXI.Graphics();
        mask.beginFill(0);
        mask.drawRoundedRect(cardback.x - 40, cardback.y - 60, 80, 120, 6);
        mask.endFill();
        cardfront.mask = mask;
        cardback.mask = mask;
        const card = new Card(posX, 200, cardfront, cardback, texture, false);
        app.stage.addChild(card.cardfront, card.cardback);
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

