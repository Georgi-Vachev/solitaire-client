import * as PIXI from 'pixi.js';

export async function initBundles() {

    await PIXI.Assets.init({
        basePath: 'assets/',
        manifest: {
            bundles: [
                {
                    name: 'cards',
                    assets: [
                        {
                            name: 'cardsTexture',
                            srcs: '22331.jpg'
                        },
                    ]
                },
                {
                    name: 'cardback',
                    assets: [
                        {
                            name: 'cardback',
                            srcs: 'cardback.png'
                        },
                    ]
                },
                {
                    name: 'blocks',
                    assets: [
                        {
                            name: 'bevel',
                            srcs: 'bevel.png'
                        },
                        {
                            name: 'hover',
                            srcs: 'hover.png'
                        },
                        {
                            name: 'inset',
                            srcs: 'inset.png'
                        },
                    ]
                }
            ]
        }
    })

    return {
        async getBoardAssets() {
            const boardAssets = await PIXI.Assets.loadBundle(['cards', 'cardback'], (progress) => {
                console.log(progress)
            })

            const cardsBundle = boardAssets.cards;
            const cardbackBundle = boardAssets.cardback;

            const atlasData = {
                frames: [] as any,
                meta: {
                    image: '',
                    format: 'RGBA8888',
                    size: { w: 6000, h: 4000 },
                    scale: '1'
                }
            }

            const cards = [
                ['CA', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'CJ', 'CQ', 'CK'],
                ['HA', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'HJ', 'HQ', 'HK'],
                ['SA', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'SJ', 'SQ', 'SK'],
                ['DA', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'DJ', 'DQ', 'DK'],
            ]

            for (let colorIndex = 0; colorIndex < cards.length; colorIndex++) {
                const row = cards[colorIndex];
                for (let offset = 0; offset < row.length; offset++) {
                    const card = row[offset];
                    const data = {
                        frame: { x: (offset * 458) + 50, y: (colorIndex * 660) + 850, w: 407, h: 618 },
                        sourceSize: { w: 407, h: 618 },
                        spriteSourceize: { x: 0, y: 0, w: 407, h: 618 }
                    };
                    atlasData.frames[card] = data;
                }
            }

            const spritesheet = new PIXI.Spritesheet(
                new PIXI.Texture(cardsBundle.cardsTexture),
                atlasData
            );

            await spritesheet.parse()

            const cardback = cardbackBundle.cardback;

            return {
                cardback,
                spritesheet,
            }
        },

        async getMenuAssets() {
            const menuAssets = await PIXI.Assets.loadBundle('blocks', (progress) => {
                console.log(progress)
            })

            const blocksBundle = menuAssets.blocks;

            return blocksBundle
        },
    }
}

export function createPixiApp(): PIXI.Application {
    const app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x00a000, antialias: true });

    (app.view as HTMLCanvasElement).style.borderRadius = '30px';
    (app.view as HTMLCanvasElement).style.border = 'solid 2px #fff';
    (app.view as HTMLCanvasElement).style.boxShadow = '#333 0 0 7px';
    (app.view as HTMLCanvasElement).style.margin = 'auto 0';

    return app;
}

export type TCard = {
    x: number;
    y: number;
    cardfront: PIXI.Sprite;
    cardback: PIXI.Sprite;
    rank: string;
    suit: string;
    faceUp: boolean;
    tl?: any
}