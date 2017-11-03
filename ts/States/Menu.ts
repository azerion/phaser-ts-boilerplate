import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../Fabrique/IGame';

import SoundManager from '../Fabrique/Managers/SoundManager';
import SaveGame from '../Fabrique/SaveGame';
import LabeledButton from '../Fabrique/Objects/LabeledButton';

import { Constants, Atlases, Sounds } from '../Data';

import Gameplay from './Gameplay';

export default class Menu extends Phaser.State {
    public static Name: string = 'menu';

    public name: string = Menu.Name;
    public game: IGame;

    private background: Phaser.Image;
    private logo: Phaser.Image;
    private testImgBtn: LabeledButton;
    private testGrBtn: LabeledButton;

    constructor() {
        super();
    }

    public init(): void {
        this.game.world.removeAll();

        SaveGame.getInstance(this.game);
        SoundManager.getInstance(this.game);
    }

    public create(): void {
        super.create();

        //Send a screen view to Google to track different states
        // this.game.analytics.google.sendScreenView(this.name);

        this.background = this.game.add.image(0, 0, Atlases.Interface, 'bg_menu');

        this.logo = this.game.add.image(0, 0, Atlases.Interface, 'OG_logo_fullcolor');
        this.logo.anchor.set(0.5);

        let textStyle: any = {font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF'};

        //This button uses images for textures, just like normal Phaser.Buttons
        this.testImgBtn = new LabeledButton(this.game, 0, 0, 'LONG TEXT FITS IN BUTTON', textStyle, this.buttonClick, this);
        this.testImgBtn.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');

        //This button is made by generating the texture with graphics
        this.testGrBtn = new LabeledButton(this.game, 0, 0, 'PLAY', textStyle, this.startGame, this, 300, 100);
        this.testGrBtn.createTexture(0xf98f25);

        this.resize();
    }

    private buttonClick(): void {
        SoundManager.getInstance().play(Sounds.Click);
    }

    /**
     * Start the gameplay state
     */
    private startGame(): void {
        SoundManager.getInstance().play(Sounds.Click);

        this.game.state.add(Gameplay.Name, Gameplay, true);
    }

    /**
     * Called every time the rotation or game size has changed.
     * Rescales and repositions the objects.
     */
    public resize(): void {
        this.background.width = this.game.width;
        this.background.height = this.game.height;

        //Reset logo scaling because we're gonna use its size to recalculate the assets scaling
        this.logo.scale.set(1);

        //Calculate new scaling based on the logo size
        let assetsScaling: number = 1;
        if (this.game.width > this.game.height) {
            assetsScaling = this.game.width / (this.logo.width * 1.5);
        } else {
            assetsScaling = this.game.width / this.logo.width;
        }
        //Check that the scaling is not bigger than 1 to prevent unnecessary blurriness
        assetsScaling = assetsScaling > 1 ? 1 : assetsScaling;

        //Set the new scaling and reposition the logo
        this.logo.scale.set(assetsScaling);
        this.logo.alignIn(this.world.bounds, Phaser.CENTER, 0, -60 * Constants.GAME_SCALE);

        //Do the same for the the buttons
        this.testImgBtn.updateScaling(assetsScaling);
        this.testImgBtn.x = this.logo.x / 2;
        this.testImgBtn.y = this.logo.y + this.logo.height * 0.65;

        this.testGrBtn.updateScaling(assetsScaling);
        this.testGrBtn.x = this.logo.x + this.logo.x / 2;
        this.testGrBtn.y = this.testImgBtn.y;
    }
}
