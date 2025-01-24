// server.js
import { WebSocketServer } from 'ws';

/*
  ======= 1) Deck / Shuffle / Deal =======
*/

// Create a standard 52-card deck (suit ∈ {clubs, diamonds, hearts, spades}, face ∈ {1..13})
function createDeck() {
    const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
    const deck = [];
    for (let suit of suits) {
        for (let face = 1; face <= 13; face++) {
            deck.push({ suit, face, faceUp: false }); // faceDown by default
        }
    }
    return deck;
}

// Fisher-Yates shuffle
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Deal 7 piles, each i having i+1 cards. The top card is face-up.
function dealTableau(deck) {
    const piles = [[], [], [], [], [], [], []];
    let index = 0;
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = deck[index++];
            if (j === i) {
                card.faceUp = true;
            }
            piles[i].push(card);
        }
    }
    return { piles, nextIndex: index };
}

/*
  ======= 2) Solitaire Rule Checks (Simplified) =======
*/

// Red suits vs. black suits
function isRed(suit) {
    return suit === 'hearts' || suit === 'diamonds';
}

// For table piles: you can only place on a face-up card that’s 1 rank higher and opposite color
// If target pile is empty, only place a KING (face=13).
function canPlaceOnTableau(card, targetCardOrNull) {
    // If no target card (empty pile), must be a KING
    if (!targetCardOrNull) {
        return card.face === 13; // 13 is King in many notations
    }
    if (!targetCardOrNull.faceUp) {
        // Can't place on a face-down card (in typical solitaire you first flip it).
        return false;
    }
    // Opposite color, and exactly 1 rank smaller than the target?
    const differentColor = isRed(card.suit) !== isRed(targetCardOrNull.suit);
    const rankOneLess = card.face === (targetCardOrNull.face - 1);
    return differentColor && rankOneLess;
}

// For foundation piles: must place same suit, rank exactly 1 higher
// If the foundation is empty, must place an ACE (face=1).
function canPlaceOnFoundation(card, foundationPile) {
    const topCard = foundationPile.cards[foundationPile.cards.length - 1];
    if (!topCard) {
        // must be an ACE
        return card.face === 1 && card.suit === foundationPile.suit;
    }
    // same suit, next rank
    return (card.suit === foundationPile.suit) && (card.face === topCard.face + 1);
}

/*
  ======= 3) In-Memory Server State =======
*/

// For simplicity, store a single game and a "heldCard" that the user 'took'
let gameState = null;
// We'll store the one card the user last "took" from a pile/waste
// along with fromWhichPile if we need to revert on invalid place:
const serverState = {
    heldCard: null,
    fromPile: null,
};

/*
  ======= 4) WebSocket Server =======
*/

const wss = new WebSocketServer({ port: 5500 });
console.log('WebSocket server is running on ws://localhost:5500');

wss.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (rawMessage) => {
        const { type, data } = JSON.parse(rawMessage.toString());
        console.log('Received:', type, data);

        switch (type) {
            /*
              ========== IDENTITY ==========
            */
            case 'identity': {
                // The client sends 'identity' with a nickname. We'll just accept
                socket.send(JSON.stringify({ type: 'identity', data: true }));
                break;
            }

            /*
              ========== START GAME ==========
            */
            case 'startGame': {
                // Create, shuffle, deal
                const deck = shuffleDeck(createDeck());
                const { piles, nextIndex } = dealTableau(deck);
                const stockCards = deck.slice(nextIndex);

                // Build the game state
                gameState = {
                    foundations: {
                        clubs: { cards: [], suit: 'clubs', type: 'foundation' },
                        diamonds: { cards: [], suit: 'diamonds', type: 'foundation' },
                        hearts: { cards: [], suit: 'hearts', type: 'foundation' },
                        spades: { cards: [], suit: 'spades', type: 'foundation' },
                    },
                    piles: piles.map((pileCards, idx) => ({
                        cards: pileCards,
                        type: 'pile',
                        id: `pile${idx}`,
                    })),
                    stock: { cards: stockCards, type: 'stock' },
                    waste: { cards: [], type: 'waste' },
                };

                // Reset any "held card"
                serverState.heldCard = null;
                serverState.fromPile = null;

                // Send it to the client
                socket.send(JSON.stringify({ type: 'state', data: gameState }));
                break;
            }

            /*
              ========== MOVE ==========
            */
            case 'move': {
                if (!gameState) {
                    // If there's no game, return false
                    socket.send(JSON.stringify({ type: 'moveResult', data: false }));
                    return;
                }
                const { action, source, target, index } = data;
                console.log('Processing move =>', action, source, target, index);

                if (action === 'flip' && source === 'stock') {
                    // FLIP from stock to waste
                    if (gameState.stock.cards.length > 0) {
                        const topCard = gameState.stock.cards.shift();
                        topCard.faceUp = true;
                        gameState.waste.cards.push(topCard);
                        // Return the card object => triggers the client to reveal it
                        socket.send(JSON.stringify({ type: 'moveResult', data: topCard }));
                    } else {
                        // No card left to flip
                        socket.send(JSON.stringify({ type: 'moveResult', data: false }));
                    }
                }

                else if (action === 'take') {
                    // TAKE a card from 'source' at 'index'
                    // We'll remove that card from the array and store it in serverState.heldCard
                    let card = null;
                    let fromArr = null;

                    if (source.startsWith('pile')) {
                        // e.g. 'pile0'
                        const pileIndex = parseInt(source.slice(4));
                        fromArr = gameState.piles[pileIndex].cards;
                    } else if (source === 'stock') {
                        fromArr = gameState.waste.cards;
                        // front-end uses 'stock' to refer to the waste top? (From your code)
                        // If that's how your front end is coded, adjust accordingly.
                    } else if (['clubs', 'diamonds', 'hearts', 'spades'].includes(source)) {
                        // Possibly a foundation
                        fromArr = gameState.foundations[source].cards;
                    } else if (source === 'waste') {
                        fromArr = gameState.waste.cards;
                    }

                    if (!fromArr || fromArr.length <= index || index < 0) {
                        // Invalid index
                        socket.send(JSON.stringify({ type: 'moveResult', data: false }));
                        return;
                    }

                    card = fromArr.splice(index, 1)[0]; // Remove that card
                    if (!card || !card.faceUp) {
                        // Usually can only take a face-up card
                        socket.send(JSON.stringify({ type: 'moveResult', data: false }));
                        return;
                    }
                    // Keep track
                    serverState.heldCard = card;
                    serverState.fromPile = { arr: fromArr, source };
                    // Return "true" => client knows it can proceed
                    socket.send(JSON.stringify({ type: 'moveResult', data: true }));
                }

                else if (action === 'place') {
                    // PLACE the card from serverState.heldCard onto 'target'
                    const movingCard = serverState.heldCard;
                    if (!movingCard) {
                        // We have no card in hand
                        socket.send(JSON.stringify({ type: 'moveResult', data: false }));
                        return;
                    }

                    // Figure out the target array
                    let toArr = null;
                    let foundationPileObj = null; // if foundation, we'll check suit-based rules

                    if (target.startsWith('pile')) {
                        const pileIndex = parseInt(target.slice(4));
                        if (!gameState.piles[pileIndex]) {
                            socket.send(JSON.stringify({ type: 'moveResult', data: false }));
                            return;
                        }
                        toArr = gameState.piles[pileIndex].cards;
                    } else if (['clubs', 'diamonds', 'hearts', 'spades'].includes(target)) {
                        // Must be foundation
                        foundationPileObj = gameState.foundations[target];
                        toArr = foundationPileObj.cards;
                    } else if (target === 'waste') {
                        // Typically not a valid place target in Klondike, but you could allow it
                        toArr = gameState.waste.cards;
                    }

                    if (!toArr) {
                        // Invalid target
                        // Put the card back to the original array
                        serverState.fromPile.arr.push(movingCard);
                        serverState.heldCard = null;
                        serverState.fromPile = null;
                        socket.send(JSON.stringify({ type: 'moveResult', data: false }));
                        return;
                    }

                    // Check rules
                    let canPlace = false;
                    if (foundationPileObj) {
                        // check foundation rules
                        canPlace = canPlaceOnFoundation(movingCard, foundationPileObj);
                    } else {
                        // table/waste rules
                        const top = toArr.length > 0 ? toArr[toArr.length - 1] : null;
                        canPlace = canPlaceOnTableau(movingCard, top);
                    }

                    if (canPlace) {
                        // Good move
                        toArr.push(movingCard);

                        // Clear heldCard
                        serverState.heldCard = null;
                        serverState.fromPile = null;

                        // Return success
                        socket.send(JSON.stringify({ type: 'moveResult', data: true }));
                    } else {
                        // Invalid move. Return card to original location
                        serverState.fromPile.arr.push(movingCard);
                        serverState.heldCard = null;
                        serverState.fromPile = null;

                        // Return false
                        socket.send(JSON.stringify({ type: 'moveResult', data: false }));
                    }
                }

                else {
                    // Unknown action
                    socket.send(JSON.stringify({ type: 'moveResult', data: false }));
                }

                break;
            }

            /*
              ========== DISCONNECT ==========
            */
            case 'disconnect': {
                console.log('Client requested disconnect');
                socket.close();
                break;
            }

            default:
                console.log('Unknown message type:', type);
                break;
        }
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});
