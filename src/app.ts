import * as PIXI from 'pixi.js';

// Import classes for the card, deck, piles, etc.
import { Deck } from './Deck';
import { DrawPile } from './Piles/Draw-pile';
import { createPixiApp, createSpritesContainer, createTiles, drawIndicator, initBundles } from './util';
import { Button, InputField } from './UI';
import { WastePile } from './Piles/Waste-pile';
import { FoundationPile } from './Piles/Foundation-pile';
import { TablePile } from './Piles/Table-pile';
import { Connection } from './Connection';

const disconnectBtn: HTMLElement = document.getElementById('disconnect');

// Create the PIXI app
const app = createPixiApp(0x00a000);
document.body.appendChild(app.view as HTMLCanvasElement);

const bundles = initBundles();
let menuAssets;

let connection = null;
let usernameInputField: InputField;
let username: string = '';

interface State {
    foundations: {
        clubs: {
            cards: [],
            suit: "clubs",
            type: "foundation"
        },
        diamonds: {
            cards: [],
            suit: "diamonds",
            type: "foundation"
        },
        hearts: {
            cards: [],
            suit: "hearts",
            type: "foundation"
        },
        spades: {
            cards: [],
            suit: "spades",
            type: "foundation"
        }
    },
    piles: [
        {
            cards: Array<{ face: number, suit: string, faceUp: boolean }>,
            type: 'pile'
        },
        {
            cards: Array<{ face: number, suit: string, faceUp: boolean }>,
            type: 'pile'
        },
        {
            cards: Array<{ face: number, suit: string, faceUp: boolean }>,
            type: 'pile'
        },
        {
            cards: Array<{ face: number, suit: string, faceUp: boolean }>,
            type: 'pile'
        },
        {
            cards: Array<{ face: number, suit: string, faceUp: boolean }>,
            type: 'pile'
        },
        {
            cards: Array<{ face: number, suit: string, faceUp: boolean }>,
            type: 'pile'
        },
        {
            cards: Array<{ face: number, suit: string, faceUp: boolean }>,
            type: 'pile'
        },
    ],
    stock: {
        cards: []
        type: "stock"
    },
    waste: {
        cards: []
        type: "waste"
    },
}

let state: State;

welcomeScreen();

disconnectBtn.addEventListener('click', () => {
    connection?.disconnect();
    welcomeScreen();
});

async function initConnection() {
    connection = new Connection(username as string);
    await connection.open();
    await connection.on('state', (newState: State) => {
        state = newState;
        showBoard();
    });
    connection.send('startGame');
}

async function showBoard() {
    app.stage.removeChildren();
    app.ticker.remove(update);
    disconnectBtn.style.display = 'block';
    populateBoard();
}
export let wastePile: WastePile;

async function populateBoard() {
    //load Assets
    const boardAssets = await ((await bundles).getBoardAssets());
    const spritesheetAsset = boardAssets.spritesheet;
    const cardbackAsset = boardAssets.cardback;
    // Create the deck and piles
    const deck = new Deck(cardbackAsset);
    const drawPile = new DrawPile(deck, 20, 20);
    drawPile.container.interactive = true;
    wastePile = new WastePile(80, 20);

    const foundationPiles = [
        new FoundationPile('Hearts', 200, 20),
        new FoundationPile('Spades', 260, 20),
        new FoundationPile('Diamonds', 320, 20),
        new FoundationPile('Clubs', 380, 20),
    ];
    const tableauPiles = [
        new TablePile(20, 100),
        new TablePile(80, 100),
        new TablePile(140, 100),
        new TablePile(200, 100),
        new TablePile(260, 100),
        new TablePile(320, 100),
        new TablePile(380, 100),
    ];

    // Add the deck and piles to the stage
    app.stage.addChild(drawPile.container, wastePile.container);

    foundationPiles.forEach((pile) => {
        pile.container.interactive = true;
        const placeholder = new PIXI.Graphics();
        placeholder.beginFill(0x000000, .5);
        placeholder.drawRoundedRect(pile.container.x, pile.container.y, 80, 120, 5);
        placeholder.alpha = 0;
        pile.container.addChild(placeholder);
        app.stage.addChild(pile.container);
    });

    tableauPiles.forEach((pile) => {
        app.stage.addChild(pile.container);
    });

    // Draw the respective number of card and add them across the table piles
    for (let tp = 0; tp <= 6; tp++) {
        for (let cardi = 0; cardi <= tp; cardi++) {
            const card = drawPile.drawCard();
            tableauPiles[tp].addCard(card)
            if (cardi == tp) {
                const info = state.piles[tp].cards[cardi]
                const cardFrontTexture = spritesheetAsset.textures[info.suit[0].toUpperCase() + String(info.face)]
                card.reveal(info, cardFrontTexture)
            }
            card.sprite.on('pointertap', () => {
                if (card.isFaceDown()) {
                    card.flipOnTablePile();
                }
            })
        }
    }

    // Draw a card from the Draw pile and store it in the Waste pile

    drawPile.container.on('pointertap', async () => {
        if (drawPile.cards.length > 0 && !drawPile.repopulated) {
            await connection.send('move', { action: 'flip', source: 'stock', target: null });
            connection.on('moveResult', (result) => {
                const card = drawPile.getTopCard();
                const cardFrontTexture = spritesheetAsset.textures[result.suit[0].toUpperCase() + String(result.face)]
                card.reveal(result, cardFrontTexture)
                card.flip(drawPile, wastePile);
            })
        } else if (drawPile.cards.length == 0) {
            drawPile.repopulate(wastePile);
        } else if (drawPile.cards.length > 0 && drawPile.repopulated) {
            const card = drawPile.getTopCard();
            card.flip(drawPile, wastePile);
        }
    });
}

async function welcomeScreen() {
    disconnectBtn.style.display = 'none';
    app.stage.removeChildren()
    username = '';

    // Load textures
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
//app.ticker.add(update);

let elapsed = 0;

function update(dt) {
    elapsed += dt;
    if (elapsed >= 30 && usernameInputField != undefined && usernameInputField.isSelected) {
        usernameInputField.indicator.renderable = !usernameInputField.indicator.renderable;
        elapsed = 0;
    }
}
