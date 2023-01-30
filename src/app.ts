import { Connection } from "./Connection";
import { engine } from "./engine";
import * as PIXI from 'pixi.js';
import { createPixiApp, initBundles, TCard, createSpritesContainer, createTiles, drawIndicator } from "./util";
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";
import { Card } from "./Card";
import { Button } from "./button";
import { InputField } from "./inputField";
import { StockPile } from "./Pile";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const disconnectBtn: HTMLElement = document.getElementById('disconnect');
export let app: PIXI.Application = createPixiApp(0x00a000);
let usernameInputField: InputField;
let username: string = '';

const bundles = initBundles();
let menuAssets;

let deck: TCard[] = [];

let connection = null;
welcomeScreen();

disconnectBtn.addEventListener('click', () => {
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
    disconnectBtn.style.display = 'block';

    populateBoard();
}

async function populateBoard() {
    const boardAssets = await ((await bundles).getBoardAssets());
    const spritesheetAsset = boardAssets.spritesheet;
    const cardbackAsset = boardAssets.cardback;

    for (let texture in spritesheetAsset.textures) {
        const cardfront = new PIXI.Sprite(spritesheetAsset.textures[texture])
        const cardback = new PIXI.Sprite(cardbackAsset);
        cardfront.anchor.set(0.5);
        cardback.anchor.set(0.5);
        cardfront.width = 80;
        cardfront.height = 120;
        cardback.width = 80;
        cardback.height = 120;
        const card = new Card(cardfront, cardback, texture, false);
        deck.push(card);
    }
    const pile = new StockPile(deck, app, 85, 100);
    //outlinePiles(85, 100)
}

function outlinePiles(x, y) {
    for (let i = x; i <= 750; i += 105) {
        for (let j = y; j <= 280; j += 180) {
            if (i == 295 && j == y) {
                continue;
            } else {
                new StockPile(deck, app, i, j)
            }
        }
    }
}

async function welcomeScreen() {
    disconnectBtn.style.display = 'none';
    app.stage.removeChildren()
    username = '';
    //load textures
    menuAssets = await ((await bundles).getMenuAssets())
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

    const welcomeMsg = new PIXI.Text("For when there's nothing else..", new PIXI.TextStyle({
        align: "center",
        fontFamily: 'Arial',
        fill: 0xd3daf5,
    }));

    const usernameMsg = new PIXI.Text('Username', new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff
    }));
    welcomeMsg.position.set(app.view.width / 2 - 160, app.view.height / 2 - 200)

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