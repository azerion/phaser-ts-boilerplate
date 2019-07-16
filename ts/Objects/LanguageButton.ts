import 'p2';
import 'pixi';
import 'phaser';

import {Atlases} from '../Data';

export default class LanguageButton extends Phaser.Group {
    protected languageBtn: Phaser.Sprite;
    protected maxWidth: number;
    protected maxHeight: number;

    constructor(game: Phaser.Game, language: string, callback: Function, callbackContext: any) {
        super(game);

        let background: Phaser.Image = this.game.add.image(0, 0, Atlases.Interface, 'flag_background');
        background.anchor.set(0.5);
        this.add(background);

        this.languageBtn = this.game.add.sprite(0, 1, Atlases.Interface, 'flag_' + language);
        this.languageBtn.anchor.set(0.5);
        this.languageBtn.inputEnabled = true;
        this.languageBtn.input.useHandCursor = true;
        if (callback && callbackContext) {
            this.languageBtn.events.onInputUp.add(callback, callbackContext);
        }
        this.add(this.languageBtn);

        this.game.add.existing(this);
    }

    public updateLanguage(language: string): void {
        this.languageBtn.loadTexture(Atlases.Interface, 'flag_' + language);
    }
    /**
     * Override destroy function so it also destroys the label attached to the button.
     * @param destroyChildren
     */
    public destroy(destroyChildren?: boolean): void {
        super.destroy(destroyChildren);
    }

    // /**
    //  * Play click sound every time the button is released.
    //  * @param destroyChildren
    //  */
    // private playSound(): void {
    //     SoundManager.getInstance().play(Sounds.Click);
    // }
}
