import { Container, DisplayObject, Graphics, Text, TextStyle } from 'pixi.js';

const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
});

export class InputField extends Container {
    _input: string;
    text: Text;
    isSelected: boolean;
    indicator: Graphics;

    constructor(
        input: string,
        indicator: Graphics,
        private element: DisplayObject,
        private highlight: DisplayObject,
        private selected: DisplayObject,
    ) {
        super();
        this.indicator = indicator;
        this.addChild(this.element, this.highlight, this.selected, this.indicator);
        this.highlight.renderable = false;
        this.selected.renderable = false;
        this.indicator.renderable = false;
        this._input = input;
        this.text = new Text(input, style);
        this.text.position.set(20, 12);
        this.addChild(this.text);
        this.interactive = true;
        this.on('pointerenter', this.onEnter.bind(this));
        this.on('pointerleave', this.onLeave.bind(this));
        this.on('pointerdown', this.onDown.bind(this));
    }

    get input() {
        return this._input;
    }

    set input(value: string) {
        this._input = value;
        this.text.text = value;
    }

    private onEnter() {
        this.element.renderable = false;
        this.highlight.renderable = true;
    }

    private onLeave() {
        this.element.renderable = true;
        this.highlight.renderable = false;
    }

    private onDown() {
        this.element.renderable = false;
        this.highlight.renderable = false;
        this.selected.renderable = true;
        this.isSelected = true;
        this.indicator.renderable = true;
    }

    deselect() {
        this.element.renderable = true;
        this.highlight.renderable = false;
        this.selected.renderable = false;
        this.isSelected = false;
    }
}

export class Button extends Container {
    private _label: string;
    private text: Text;

    constructor(
        label: string,
        private callback: () => void,
        private element: DisplayObject,
        private highlight: DisplayObject,
        private pressed: DisplayObject
    ) {
        super();

        this.addChild(this.element, this.highlight, this.pressed);
        this.highlight.renderable = false;
        this.pressed.renderable = false;

        this.text = new Text('', style);
        this.text.anchor.set(0.5, 0.5);
        this.label = label;
        this.addChild(this.text);

        this.interactive = true;

        this.on('pointerenter', this.onEnter.bind(this));
        this.on('pointerleave', this.onLeave.bind(this));
        this.on('pointerdown', this.onDown.bind(this));
        this.on('pointerup', this.onUp.bind(this));
    }

    get label() {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
        this.text.text = value;
        this.text.position.set(this.width / 2, this.height / 2);
    }

    private onEnter() {
        this.element.renderable = false;
        this.highlight.renderable = true;
        this.pressed.renderable = false;
    }

    private onLeave() {
        this.element.renderable = true;
        this.highlight.renderable = false;
        this.pressed.renderable = false;
    }

    private onDown() {
        this.element.renderable = false;
        this.highlight.renderable = false;
        this.pressed.renderable = true;
    }

    private onUp() {
        this.element.renderable = true;
        this.highlight.renderable = false;
        this.pressed.renderable = false;
        this.callback();
    }
}