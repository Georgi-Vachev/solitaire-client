import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

let boardAssetsLoaded = false,
    menuAssetsLoaded = false,
    menuAssets,
    spritesheet,
    cardback

let currentApp: PIXI.Application;

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
            if (!boardAssetsLoaded) {
                const loadingBar = new PIXI.Graphics();
                loadingBar.beginFill(0xFFFFFF)
                loadingBar.drawRect(currentApp.view.width / 2 - 150, currentApp.view.height / 2 - 10, 300, 20);
                loadingBar.beginFill(0xe3471b)
                currentApp.stage.addChild(loadingBar);
                const boardAssets = await PIXI.Assets.loadBundle(['cards', 'cardback'], (progress) => {
                    gsap.to(loadingBar, {
                        pixi: { width: '-=300', x: '+=400' }, duration: progress
                    })

                })
                currentApp.stage.removeChild(loadingBar);
                boardAssetsLoaded = true;
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
                            frame: { x: (offset * 458) + 55, y: (colorIndex * 660) + 855, w: 400, h: 610 },
                            sourceSize: { w: 400, h: 610 },
                            spriteSourceize: { x: 0, y: 0, w: 400, h: 610 }
                        };
                        atlasData.frames[card] = data;
                    }
                }

                spritesheet = new PIXI.Spritesheet(
                    new PIXI.Texture(cardsBundle.cardsTexture),
                    atlasData
                );

                await spritesheet.parse()

                cardback = cardbackBundle.cardback;

                return {
                    cardback,
                    spritesheet,
                }
            } else if (boardAssetsLoaded) {
                return {
                    cardback,
                    spritesheet,
                }
            }
        },

        async getMenuAssets() {
            if (!menuAssetsLoaded) {
                menuAssets = await PIXI.Assets.loadBundle('blocks', (progress) => {
                    console.log(progress)
                })
                menuAssetsLoaded = true;
                return menuAssets;
            } else if (menuAssetsLoaded) {
                return menuAssets;
            }
        },
    }
}

export function createPixiApp(color: number, oldApp?: PIXI.Application): PIXI.Application {
    if (oldApp) {
        document.body.removeChild(oldApp.view as HTMLCanvasElement);
    }
    const app = new PIXI.Application({ width: 800, height: 600, backgroundColor: color, antialias: true });

    (app.view as HTMLCanvasElement).style.borderRadius = '30px';
    (app.view as HTMLCanvasElement).style.border = 'solid 2px #fff';
    (app.view as HTMLCanvasElement).style.boxShadow = '#333 0 0 7px';
    (app.view as HTMLCanvasElement).style.margin = 'auto 0';
    currentApp = app;
    document.body.appendChild(app.view as HTMLCanvasElement)
    return app;
}

export type TCard = {
    cardfront: PIXI.Sprite;
    cardback: PIXI.Sprite;
    rank: string;
    suit: string;
    faceUp: boolean;
    tl?: any
}

export function drawIndicator() {
    return new PIXI.Graphics()
        .beginFill(0xFFFFFF)
        .drawRect(20, 10, 3, 30);
}

export function createSpritesContainer(textures: PIXI.Texture[][], width?: number, height?: number, tint?: number): PIXI.Container {
    const container = new PIXI.Container();

    //Corner sprites
    const tl = PIXI.Sprite.from(textures[0][0]);
    const tr = PIXI.Sprite.from(textures[0][2]);
    const bl = PIXI.Sprite.from(textures[2][0]);
    const br = PIXI.Sprite.from(textures[2][2]);

    //Top and Bottom sprites
    const t = PIXI.Sprite.from(textures[0][1]);
    const b = PIXI.Sprite.from(textures[2][1]);

    //Left and Right sprites
    const l = PIXI.Sprite.from(textures[1][0]);
    const r = PIXI.Sprite.from(textures[1][2]);

    //Center sprite
    const c = PIXI.Sprite.from(textures[1][1]);

    if (width < tl.width + tr.width) {
        tl.width = width / 2;
        tr.width = width / 2;
        bl.width = width / 2;
        br.width = width / 2;
    }

    if (height < tl.height + tr.height) {
        tl.height = height / 2;
        tr.height = height / 2;
        bl.height = height / 2;
        br.height = height / 2;
    }

    if (width > tl.width + tr.width) {
        t.width = width - (tl.width + tr.width);
        b.width = width - (tl.width + tr.width);

        t.position.set(tl.width, 0);
        b.position.set(bl.width, height - b.height)

        container.addChild(t, b)
    }

    if (height > tl.height + tr.height) {
        l.height = height - (tl.height + tr.height);
        r.height = height - (tl.height + tr.height);

        l.position.set(0, tl.height);
        r.position.set(width - r.width, tr.height)

        container.addChild(l, r)
    }

    if ((width > (tl.width + tr.width)) && (height > (tl.height + bl.height))) {
        c.width = width - (tl.width + tr.width);
        c.height = height - (tl.height + tr.height);

        c.position.set(tl.width, 0 + tr.height);

        container.addChild(c);
    }

    tl.position.set(0, 0);
    tr.position.set(width - tr.width, 0)
    bl.position.set(0, height - bl.height);
    br.position.set(width - br.width, height - br.height);

    if (tint) {
        tl.tint = tint;
        tr.tint = tint;
        bl.tint = tint;
        br.tint = tint;
        t.tint = tint;
        b.tint = tint;
        l.tint = tint;
        r.tint = tint;
        c.tint = tint;
    }

    container.addChild(tl, tr, bl, br);
    return container;
}


export function createTiles(baseTexture: PIXI.BaseTexture): PIXI.Texture[][] {
    //split base texture into 9 textures
    return [
        [
            getTexture(baseTexture, 0, 0, 25, 25),
            getTexture(baseTexture, 25, 0, 80, 25),
            getTexture(baseTexture, 105, 0, 25, 25)
        ],
        [
            getTexture(baseTexture, 0, 25, 25, 80),
            getTexture(baseTexture, 25, 25, 80, 80),
            getTexture(baseTexture, 105, 25, 25, 80)
        ],
        [
            getTexture(baseTexture, 0, 105, 25, 25),
            getTexture(baseTexture, 25, 105, 80, 25),
            getTexture(baseTexture, 105, 105, 25, 25)
        ]
    ]
}

function getTexture(baseTexture: PIXI.BaseTexture, x: number, y: number, w: number, h: number) {
    return new PIXI.Texture(baseTexture, new PIXI.Rectangle(x, y, w, h))
}

