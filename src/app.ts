import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from 'pixi.js';
import { createPixiApp, initBundles, createSpritesContainer, createTiles, drawIndicator } from "./util";
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";
import { Card } from "./Card";
import { TextStyle } from "pixi.js";
import { Button } from "./button";
import { InputField } from "./inputField";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const gameSection = document.getElementById('game');
const app: PIXI.Application = createPixiApp();
let usernameInputField;
let username = '';

const bundles = initBundles();

let connection = null;
welcomeScreen();

document.getElementById('disconnect').addEventListener('click', () => {
    connection?.disconnect();
    welcomeScreen();
});

async function initConnection() {

    // connection = new Connection(username as string);
    // await connection.open();
    // engine(connection);

    // connection.send('startGame');

    showBoard();
}

async function showBoard() {
    app.stage.removeChildren();
    app.ticker.remove(update);
    gameSection.style.display = 'block';

    document.getElementById('board').appendChild(app.view as HTMLCanvasElement);
    populateBoard();
    outlinePiles(50, 15);
}

async function populateBoard() {
    const boardAssets = await ((await bundles).getBoardAssets());
    const spritesheetAsset = boardAssets.spritesheet;
    const cardbackAsset = boardAssets.cardback;

    let posX = 97.5;

    for (let texture in spritesheetAsset.textures) {
        const cardfront = new PIXI.Sprite(spritesheetAsset.textures[texture])
        const cardback = new PIXI.Sprite(cardbackAsset);
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

async function welcomeScreen() {
    app.stage.removeChildren();
    document.body.appendChild(app.view as HTMLCanvasElement);
    //load textures
    const menuAssets = await ((await bundles).getMenuAssets())
    const bevelTexture = menuAssets.bevel;
    const hoverTexture = menuAssets.hover;
    const insetTexture = menuAssets.inset;

    const bevelTextures = createTiles(bevelTexture);
    const hoverTextures = createTiles(hoverTexture);
    const insetTextures = createTiles(insetTexture);

    usernameInputField = new InputField(
        "",
        drawIndicator(),
        createSpritesContainer(bevelTextures, 200, 50, 0x78a8f5),
        createSpritesContainer(bevelTextures, 200, 50, 0xd7e8f5),
        createSpritesContainer(hoverTextures, 200, 50),
    )



    const startGameBtn = new Button(
        'Start Game',
        initConnection,
        createSpritesContainer(bevelTextures, 150, 50),
        createSpritesContainer(hoverTextures, 150, 50),
        createSpritesContainer(insetTextures, 150, 50)
    );

    const welcomeMsg = new PIXI.Text('Welcome to Solitaire!', new TextStyle({
        fontFamily: 'Arial',
        fontSize: 35,
        fill: 0xd3daf5,
    }));

    welcomeMsg.position.x = 222;
    welcomeMsg.position.y = 50;


    const usernameMsg = new PIXI.Text('Username', new TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff
    }));

    usernameMsg.position.set(app.view.width / 2 - 55, app.view.height / 2 - 75);
    usernameInputField.position.set(app.view.width / 2 - 100, app.view.height / 2 - 45);
    startGameBtn.position.set(app.view.width / 2 - 75, app.view.height / 2 + 20);
    app.stage.addChild(welcomeMsg, usernameMsg, startGameBtn, usernameInputField);

}

document.addEventListener('keydown', (event) => {

    const usernameRegex = /^[\w]$/
    if (usernameInputField != undefined && usernameInputField.isSelected) {
        if (event.key.match(usernameRegex) && username.length <= 10) {
            usernameInputField.indicator.x = usernameInputField.text.width + 15;
            username += event.key;
            usernameInputField.input = username;
        } else if (event.key == 'Backspace') {
            usernameInputField.indicator.x = usernameInputField.text.width - 15;
            username = username.slice(0, username.length - 1);
            usernameInputField.input = username;
        } else if (event.key == 'Escape') {
            usernameInputField.indicator.renderable = false;
            usernameInputField.deselect();
        }
    }
    if (event.key == 'Enter') {
        if (username != "") {
            showBoard();
        }
    }
})

//create update function and add it to the app ticker 
app.ticker.add(update);

let elapsed = 0;

function update(dt) {
    elapsed += dt;
    if (elapsed >= 30 && usernameInputField != undefined && usernameInputField.isSelected) {
        usernameInputField.indicator.renderable = !usernameInputField.indicator.renderable;
        elapsed = 0;
    }
}

