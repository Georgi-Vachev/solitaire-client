import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from 'pixi.js';
import { getSpritesheet } from "./util";
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";
import { Card } from "./Card";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);



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
    const assets = await getSpritesheet(PIXI);
    const spritesheet = assets.spritesheet;

    let posX = 97;

    for (let texture in spritesheet.textures) {
        const cardfront = new PIXI.Sprite(spritesheet.textures[texture])
        const cardback = new PIXI.Sprite(assets.cardbackTexture);
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
        mask.drawRoundedRect(cardfront.x, cardfront.y, 85, 130, 10);
        mask.endFill();
        // cardfront.mask = mask;
        // cardback.mask = mask;
        const card = new Card(posX, 200, cardfront, texture, mask, false, cardback)
        app.stage.addChild(card.activeSprite);
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


// const testFront = PIXI.Sprite.from('assets/22331.jpg');
// testFront.width = 80;
// testFront.height = 120;
// testFront.position.set(300, 500);
// testFront.anchor.set(0.5, 0.5)




// app.stage.addChild(testBack, testFront);

// const tl = gsap.timeline();
// tl.to(testFront, { pixi: { skewY: 90, }, duration: 1, delay: 1 });
// tl.fromTo(testBack, { pixi: { skewY: -90 } }, { pixi: { skewY: 0 }, duration: 1 });