import * as PIXI from 'pixi.js';
import * as GSAP from 'gsap';

// Import classes for the card, deck, piles, etc.
import { Deck } from './deck';
import { DrawPile } from './Piles/draw-pile';
import { createPixiApp, createSpritesContainer, createTiles, drawIndicator, initBundles } from './util';
import { Button, InputField } from './UI';
import { WastePile } from './Piles/waste-pile';
import { FoundationPile } from './Piles/foundation-pile';
import { TablePile } from './Piles/table-pile';

const disconnectBtn: HTMLElement = document.getElementById('disconnect');

// Create the PIXI app
const app = createPixiApp(0x00a000);
document.body.appendChild(app.view as HTMLCanvasElement);

const bundles = initBundles();
let menuAssets;

let connection = null;
let usernameInputField: InputField;
let username: string = '';

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
    //load Assets
    const boardAssets = await ((await bundles).getBoardAssets());
    const spritesheetAsset = boardAssets.spritesheet;
    const cardbackAsset = boardAssets.cardback;
    // Create the deck and piles
    const deck = new Deck(spritesheetAsset, cardbackAsset);
    const drawPile = new DrawPile(deck, 20, 20);
    drawPile.container.interactive = true;
    const wastePile = new WastePile(80, 20);

    const foundationPiles = [
        new FoundationPile('Hearts', 200, 20),
        new FoundationPile('Spades', 260, 20),
        new FoundationPile('Diamonds', 320, 20),
        new FoundationPile('Clubs', 380, 20),
    ];
    const tableauPiles = [
        new TablePile(20, 120),
        new TablePile(80, 120),
        new TablePile(140, 120),
        new TablePile(200, 120),
        new TablePile(260, 120),
        new TablePile(320, 120),
        new TablePile(380, 120),
    ];

    // Add the deck and piles to the stage
    app.stage.addChild(drawPile.container, wastePile.container);

    foundationPiles.forEach((pile) => {
        app.stage.addChild(pile.container);
    });

    tableauPiles.forEach((pile) => {
        app.stage.addChild(pile.container);
    });

    // Draw a card from the Draw pile and store it in the Waste pile

    wastePile.drawFromDrawPile(drawPile);
    drawPile.container.on('pointertap', () => {
        drawPile.getTopCard().flip(drawPile, wastePile);
    });
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
