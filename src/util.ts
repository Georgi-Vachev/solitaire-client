export async function getSpritesheet(PIXI) {

    const cardbackTexture = PIXI.Texture.from('assets/cardback.png')

    const atlasData = {
        frames: [],
        meta: {
            image: 'assets/22331.jpg',
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
        PIXI.BaseTexture.from(atlasData.meta.image),
        atlasData
    );

    await spritesheet.parse()

    return {
        cardbackTexture
        , spritesheet
    };
}
