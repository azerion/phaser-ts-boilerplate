import 'p2';
import 'pixi';
import 'phaser';

import {Sounds, Atlases} from '../Data';
import SoundManager from '../Managers/SoundManager';

export default class ToggleButton extends Phaser.Button {
    protected id: string;

    private currentSpr: string;
    private sprite1: string;
    private sprite2: string;

    constructor(game: Phaser.Game, x: number, y: number, sprite1: string, sprite2: string, callback: Function, callbackContext: any) {
        super(game, x, y, Atlases.Interface, callback, callbackContext);

        this.sprite1 = sprite1;
        this.sprite2 = sprite2;
        this.currentSpr = this.sprite1;

        this.setFrames(this.sprite1, this.sprite1, this.sprite1, this.sprite1);

        this.anchor.set(0.5);

        this.onInputUp.add(this.playSound, this);

        this.game.add.existing(this);
    }

    public toggle(): void {
        let newSprite: string = this.currentSpr === this.sprite1 ? this.sprite2 : this.sprite1;
        this.setFrames(newSprite, newSprite, newSprite, newSprite);
        this.currentSpr = newSprite;
    }

    /**
     * Override destroy function so it also destroys the label attached to the button.
     * @param destroyChildren
     */
    public destroy(destroyChildren?: boolean): void {
        this.id = null;

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
