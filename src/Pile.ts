import * as PIXI from 'pixi.js'

export class StockPile {
    public deck: PIXI.DisplayObject[];
    private app: PIXI.Application;
    public container: PIXI.Container;
    private x: number;
    private y: number;

    constructor(deck: PIXI.DisplayObject[], app: PIXI.Application, x: number, y: number){
        this.deck = deck;
        this.app = app;
        this.x = x;
        this.y = y;
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.drawPile();
    }

    private drawPile(){
        const pileBorder = new PIXI.Graphics();
                pileBorder.lineStyle(2, 0xFFCC00, 1);
                pileBorder.drawRoundedRect(0, 0, 95, 140, 5);
                pileBorder.endFill();
                this.container.position.set(this.x, this.y);
                this.container.pivot.set(47.5, 70)
                this.container.addChild(pileBorder);
                this.app.stage.addChild(this.container);
    }
    
    
}
