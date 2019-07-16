import 'p2';
import 'pixi';
import 'phaser';

import {Atlases, Sounds} from '../Data';
import LanguageButton from './LanguageButton';
import Constants from '../Data/Constants';
import SoundManager from '../Managers/SoundManager';
import SaveDataManager from '../Managers/SaveDataManager';

export default class LanguageMenu extends Phaser.Group {
    public buttonWidth: number;
    public buttonHeight: number;
    public onLanguageChange: Phaser.Signal;

    private menuBg: Phaser.Graphics;
    private selectedLanguageBtn: LanguageButton;
    private selectedLanguage: string;
    private menuMask: Phaser.Graphics;
    private foldMenu: Phaser.Group;
    private otherLanguages: Phaser.Sprite[];
    private menuOpen: boolean = false;
    private animatingMenu: boolean = false;

    constructor(game: Phaser.Game) {
        super(game);

        this.selectedLanguage = SaveDataManager.getInstance().language;
        this.onLanguageChange = new Phaser.Signal();

        this.foldMenu = new Phaser.Group(this.game);
        this.add(this.foldMenu);

        this.selectedLanguageBtn = new LanguageButton(this.game, this.selectedLanguage, this.toggleMenu, this);
        this.add(this.selectedLanguageBtn);

        this.buttonWidth = this.selectedLanguageBtn.width;
        this.buttonHeight = this.selectedLanguageBtn.height;

        this.menuBg = this.game.add.graphics(0, 0);
        this.menuBg.beginFill(0xffffff, 0.5);
        this.menuBg.drawRoundedRect(0, 0, this.selectedLanguageBtn.width * 0.9, this.selectedLanguageBtn.height * ((Constants.AVAILABLE_LANGUAGES.length - 0.75) * 1.05), 5);
        this.menuBg.endFill();
        this.menuBg.x = -this.menuBg.width / 2;
        this.foldMenu.add(this.menuBg);

        this.otherLanguages = [];
        let heightCounter: number = 0;
        for (let i: number = 0; i < Constants.AVAILABLE_LANGUAGES.length; i++) {
            if (Constants.AVAILABLE_LANGUAGES[i] !== this.selectedLanguage) {
                heightCounter++;

                let flag: Phaser.Sprite = new Phaser.Sprite(this.game, 0, ((this.selectedLanguageBtn.height * 0.95) * heightCounter) + 10,
                    Atlases.Interface, 'flag_' + Constants.AVAILABLE_LANGUAGES[i]);
                flag.anchor.setTo(0.5, 0.5);
                flag.scale.setTo(0.75);
                flag.inputEnabled = true;
                flag.input.useHandCursor = true;
                flag.events.onInputDown.add(this.onFlagClicked, this, 1);
                this.foldMenu.add(flag);
                this.otherLanguages.push(flag);
                flag.inputEnabled = false;
            }
        }

        this.menuMask = this.game.add.graphics(0, 0);
        this.menuMask.beginFill(0x0000000, 0.5);
        this.menuMask.drawRect(-this.selectedLanguageBtn.width / 2, 0, this.selectedLanguageBtn.width, this.foldMenu.height);
        this.menuMask.endFill();
        this.foldMenu.mask = this.menuMask;

        this.foldMenu.y = -this.foldMenu.height;

        this.game.add.existing(this);
    }

    private toggleMenu(): void {
        if (this.animatingMenu) {
            return;
        }
        SoundManager.getInstance().play(Sounds.Click);
        if (this.menuOpen) {
            //Close menu
            this.animatingMenu = true;
            this.menuOpen = false;
            for (let i: number = 0; i < this.otherLanguages.length; i++) {
                this.otherLanguages[i].inputEnabled = false;
            }
            let outTween: Phaser.Tween = this.game.add.tween(this.foldMenu).to({y: -this.foldMenu.height}, 300, Phaser.Easing.Quadratic.Out);
            outTween.start();
            outTween.onComplete.add(this.onAnimationFinihed, this, 1, false);
        } else {
            //Open menu
            this.animatingMenu = true;
            this.menuOpen = true;
            let inTween: Phaser.Tween = this.game.add.tween(this.foldMenu).to({y: 0}, 300, Phaser.Easing.Quadratic.Out);
            inTween.start();
            inTween.onComplete.add(this.onAnimationFinihed, this, 1, true);
        }
    }

    private onAnimationFinihed(targetObject: Phaser.Sprite, targetTween: Phaser.Tween, open: boolean): void {
        this.animatingMenu = false;
        if (open) {
            for (let i: number = 0; i < this.otherLanguages.length; i++) {
                this.otherLanguages[i].inputEnabled = true;
            }
        }
    }

    private onFlagClicked(clickedSprite: Phaser.Sprite): void {
        SoundManager.getInstance().play(Sounds.Click);

        let prevLangCode: string = this.selectedLanguage;

        this.selectedLanguage = clickedSprite.frameName.slice(-2);
        SaveDataManager.getInstance().language = this.selectedLanguage;
        this.selectedLanguageBtn.updateLanguage(this.selectedLanguage);

        clickedSprite.frameName = 'flag_' + prevLangCode;

        this.toggleMenu();
        this.onLanguageChange.dispatch();
    }

    public resize(x: number, y: number, scaling: number): void {
        this.scale.set(scaling);

        this.x = x;
        this.y = y;

        this.menuMask.x = this.x;
        this.menuMask.y = this.y;
    }

    /**
     * Override destroy function so it also destroys the label attached to the button.
     * @param destroyChildren
     */
    public destroy(destroyChildren?: boolean): void {
        super.destroy(destroyChildren);
    }
}
