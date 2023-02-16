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
import { Card } from './Card';

const disconnectBtn: HTMLElement = document.getElementById('disconnect');

// Create the PIXI app
const app = createPixiApp(0x00a000);
document.body.appendChild(app.view as HTMLCanvasElement);

const bundles = initBundles();
let menuAssets;

export let connection = null;
export let selectedCard: Card;
let sourcePile;
let cardIndex;
let usernameInputField: InputField;
let username: string = '';
let foundationPiles;
let tableauPiles;
let deck;
let cardTaken = false;


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
export let availableMoves;

welcomeScreen();

disconnectBtn.addEventListener('click', () => {
    connection?.disconnect();
    welcomeScreen();
});

async function initConnection() {
    connection = new Connection(username);
    await connection.open();
    await connection.on('state', (newState: State) => {
        state = newState;
        console.log(state)
        showBoard();
    });
    connection.send('startGame');
}

async function showBoard() {
    app.stage.removeChildren();
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
    deck = new Deck(cardbackAsset);
    const drawPile = new DrawPile(deck, 20, 20);
    drawPile.container.interactive = true;
    wastePile = new WastePile(80, 20);

    tableauPiles = [
        new TablePile(20, 100, 'pile0'),
        new TablePile(80, 100, 'pile1'),
        new TablePile(140, 100, 'pile2'),
        new TablePile(200, 100, 'pile3'),
        new TablePile(260, 100, 'pile4'),
        new TablePile(320, 100, 'pile5'),
        new TablePile(380, 100, 'pile6'),
    ];
    foundationPiles = [
        new FoundationPile('Hearts', 200, 20),
        new FoundationPile('Spades', 260, 20),
        new FoundationPile('Diamonds', 320, 20),
        new FoundationPile('Clubs', 380, 20),
    ];


    // Add the deck and piles to the stage
    app.stage.addChild(wastePile.container, drawPile.container);

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

    connection.on('moves', (moves) => {
        availableMoves = moves;
    })

    connection.on('moveResult', (result) => {
        if (typeof result != 'boolean' && drawPile.cards.length > 0) {
            const card = drawPile.getTopCard();
            const cardFrontTexture = spritesheetAsset.textures[result.suit[0].toUpperCase() + String(result.face)]
            card.reveal(result, cardFrontTexture)
            card.flip(drawPile, wastePile);
        } else if (result) {

            if (cardTaken) {
                // selectedCard.isSelected = false;
                // console.log('deselect card')
                // selectedCard = null;
            }
            else if (selectedCard && cardTaken) {

            }
        }
    })

    // Draw a card from the Draw pile and store it in the Waste pile

    app.stage.on('pointertap', async (e) => {
        const container = e.target.parent;
        const containerIndex = container.parent.children.indexOf(container);
        console.log(container)
        let containerType = '';
        switch (containerIndex) {
            case 0:
                containerType = 'stock'
                break;
            case 1:
                containerType = 'stock2'
                break;
            case 2:
                containerType = 'clubs'
                break;
            case 3:
                containerType = 'diamonds'
                break;
            case 4:
                containerType = 'hearts'
                break;
            case 5:
                containerType = 'spades'
                break;
            case 6:
                containerType = 'pile0'
                break;
            case 7:
                containerType = 'pile1'
                break;
            case 8:
                containerType = 'pile2'
                break;
            case 9:
                containerType = 'pile3'
                break;
            case 10:
                containerType = 'pile4'
                break;
            case 11:
                containerType = 'pile5'
                break;
            case 12:
                containerType = 'pile6'
                break;
            default:
                break;
        }
        if (containerType == 'stock2') {
            if (drawPile.cards.length > 0 && !drawPile.repopulated) {
                await connection.send('move', { action: 'flip', source: 'stock', target: null });
            } else if (drawPile.cards.length == 0) {
                drawPile.repopulate(wastePile);
            } else if (drawPile.cards.length > 0 && drawPile.repopulated) {
                const card = drawPile.getTopCard();
                card.flip(drawPile, wastePile);
            }
        }
        else if (e.target instanceof PIXI.Sprite && !cardTaken) {
            cardIndex = container.children.indexOf(e.target) - 1;
            for (let pile of tableauPiles) {
                if (pile.type == containerType) {
                    selectedCard = pile.cards[cardIndex];
                }
            }
            for (let pile of foundationPiles) {
                if (pile.suit == containerType) {
                    selectedCard = pile.cards[cardIndex];
                }
            }
            if (containerType == 'stock') {
                selectedCard = wastePile.cards[cardIndex];
            }
            console.log(`Taking: [ ${selectedCard.rank}, ${selectedCard.suit} ] from pile [ ${containerType} ]`)
            connection.send('move', {
                action: 'take',
                source: containerType,
                target: null,
                index: cardIndex
            })
            sourcePile = containerType;
            cardTaken = true;
        } else if (e.target instanceof PIXI.Sprite && cardTaken) {
            console.log(`Placing: [ ${selectedCard.rank}, ${selectedCard.suit} ] on pile [ ${containerType} ]`)
            connection.send('move', {
                action: 'place',
                source: sourcePile,
                target: containerType,
                index: cardIndex,
            })
            cardTaken = false;
        }
    })
}

async function welcomeScreen() {
    disconnectBtn.style.display = 'none';
    app.stage.removeChildren()
    app.stage.off('pointertap');
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
app.ticker.add(update);

let elapsed = 0;

function update(dt) {
    elapsed += dt;
    if (elapsed >= 30 && usernameInputField != undefined && usernameInputField.isSelected) {
        usernameInputField.indicator.renderable = !usernameInputField.indicator.renderable;
        elapsed = 0;
    }

}
