import 'p2';
import 'pixi';
import 'phaser';

import Label from './Label';
import {Sounds, Atlases, Constants} from '../Data';
import SoundManager from '../Managers/SoundManager';

export default class LabeledButton extends Phaser.Button {
    protected id: string;
    protected label: Label;

    protected maxWidth: number;
    protected maxHeight: number;

    constructor(game: Phaser.Game, x: number, y: number, text: string, textStyle: any, callback: Function, callbackContext: any, maxWidth?: number, maxHeight?: number) {
        super(game, x, y, Atlases.Interface, callback, callbackContext);

        this.anchor.set(0.5);

        this.maxWidth = maxWidth ? maxWidth : this.width;
        this.maxHeight = maxHeight ? maxHeight : this.height;

        this.label = new Label(this.game, 0, 2 * Constants.GAME_SCALE, text, textStyle, this.maxWidth, this.maxHeight);
        this.label.anchor.set(0.5);
        this.addChild(this.label);

        this.onInputUp.add(this.playSound, this);

        this.game.add.existing(this);
    }

    /**
     * Create easily a texture with graphics.
     * @param bgColor
     */
    public createTexture(bgColor: number): void {
        //Create a texture with shadow and use it as the texture of the button.
        let graphics: Phaser.Graphics = this.game.make.graphics(0, 0);
        graphics.beginFill(0x000000, 0.3)
            .drawRoundedRect(5, 5 * Constants.GAME_SCALE, this.maxWidth - 10 * Constants.GAME_SCALE, this.maxHeight, 15 * Constants.GAME_SCALE)
            .beginFill(bgColor)
            .drawRoundedRect(0, 0, this.maxWidth, this.maxHeight, 15 * Constants.GAME_SCALE)
            .lineStyle(3, 0xffffff)
            .drawRoundedRect(0, 0, this.maxWidth - 2, this.maxHeight - 2, 15 * Constants.GAME_SCALE)
            .endFill();
        this.texture = graphics.generateTexture();

        graphics.destroy(true);
    }

    /**
     * Call the setText function of the button's label.
     */
    public setText(text: string): void {
        this.label.setText(text);
    }

    /**
     * Updates the scaling until the text fits the given size.
     * @param {number} scale
     */
    public updateScaling(scale: number): void {
        this.scale.set(scale);

        this.label.setMaxSize(this.width * 0.90, this.height * 0.98);
        this.label.setText(this.label.text);
    }

    /**
     * Override destroy function so it also destroys the label attached to the button.
     * @param destroyChildren
     */
    public destroy(destroyChildren?: boolean): void {
        this.label.destroy(destroyChildren);

        this.id = null;
        this.label = null;

        super.destroy(destroyChildren);
    }

    /**
     * Play click sound every time the button is released.
     * @param destroyChildren
     */
    private playSound(): void {
        SoundManager.getInstance().play(Sounds.Click);
    }
}
