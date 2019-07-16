import 'p2';
import 'pixi';
import 'phaser';

import IGame from '../Fabrique/IGame';

import SoundManager from '../Managers/SoundManager';
import LabeledButton from '../Objects/LabeledButton';

import {Constants, Atlases, Sounds} from '../Data';

import Gameplay from './Gameplay';
import LanguageMenu from '../Objects/LanguageMenu';
import ToggleButton from '../Objects/ToggleButton';
import SaveDataManager from '../Managers/SaveDataManager';

export default class Menu extends Phaser.State {
    public static Name: string = 'menu';

    public name: string = Menu.Name;
    public game: IGame;

    private background: Phaser.Image;
    private logo: Phaser.Image;
    private testImgBtn: LabeledButton;
    private testGrBtn: LabeledButton;
    private sfxBtn: ToggleButton;
    private musicBtn: ToggleButton;
    private languageMenu: LanguageMenu;

    private brandingLogo: Phaser.Image;
    private moreGamesBtn: LabeledButton;
    private moreGamesMenu: Fabrique.MoreGames.Menu = null;

    constructor() {
        super();
    }

    public init(): void {
        this.game.world.removeAll();

        //Play background music.
        SoundManager.getInstance(this.game).playMusic(Sounds.MenuMusic);
    }

    public create(): void {
        super.create();

        //Send a screen view to Google to track different states
        // this.game.analytics.google.sendScreenView(this.name);

        this.background = this.game.add.image(0, 0, Atlases.Interface, 'bg_orange');

        this.logo = this.game.add.image(0, 0, Atlases.Interface, 'azerion_logo');
        this.logo.anchor.set(0.5);

        let textStyle: any = {font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF'};

        //This button uses images for textures, just like normal Phaser.Buttons
        this.testImgBtn = new LabeledButton(this.game, 0, 0, 'long_text', textStyle, this.startGame, this);
        this.testImgBtn.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');

        //This button is made by generating the texture with graphics
        this.testGrBtn = new LabeledButton(this.game, 0, 0, 'play', textStyle, this.startGame, this, 300, 100);
        this.testGrBtn.createTexture(0xf98f25);

        this.sfxBtn = new ToggleButton(this.game, 0, 0, 'btn_sfx_on', 'btn_sfx_off', this.toggleSfx, this);

        this.musicBtn = new ToggleButton(this.game, 0, 0, 'btn_music_on', 'btn_music_off', this.toggleMusic, this);

        this.languageMenu = new LanguageMenu(this.game);
        this.languageMenu.onLanguageChange.add(this.updateText, this);

        this.brandingLogo = Fabrique.Branding.getLogoWithLink(this.game, Constants.GAME_NAME);
        this.game.add.existing(this.brandingLogo);

        this.moreGamesBtn = new LabeledButton(this.game, 0, 0, 'more_games', textStyle, this.openMoreGamesMenu, this);
        this.moreGamesBtn.setFrames('btn_orange', 'btn_orange', 'btn_orange_onpress', 'btn_orange');
        if (Fabrique.Branding.outGoingLinksAllowed(this.game)) {
            this.moreGamesMenu = new Fabrique.MoreGames.Menu(this.game, Constants.GAME_NAME);
            this.moreGamesMenu.x = this.game.width / 2;
            this.moreGamesMenu.y = this.game.height / 2;
            this.game.add.existing(this.moreGamesMenu);
        } else {
            this.moreGamesBtn.visible = false;
        }

        this.resize();

        this.updateSoundButtons();
    }

    /**
     * Start the game play state
     */
    private startGame(): void {
        this.game.state.add(Gameplay.Name, Gameplay, true);
    }

    private toggleSfx(): void {
        SoundManager.getInstance().toggleSfx();
        SoundManager.getInstance().play(Sounds.Click);

        this.sfxBtn.toggle();
        this.updateSoundButtons();
    }

    private toggleMusic(): void {
        SoundManager.getInstance().toggleMusic();
        SoundManager.getInstance().play(Sounds.Click);

        this.musicBtn.toggle();
        this.updateSoundButtons();
    }

    private updateSoundButtons(): void {
        let sfxImg: string = SaveDataManager.getInstance().sfx ? 'btn_sfx_on' : 'btn_sfx_off';
        this.sfxBtn.loadTexture(Atlases.Interface, sfxImg);

        let musicImg: string = SaveDataManager.getInstance().music ? 'btn_music_on' : 'btn_music_off';
        this.musicBtn.loadTexture(Atlases.Interface, musicImg);
    }

    private updateText(): void {
        this.testImgBtn.setText('long_text');
        this.testGrBtn.setText('play');
        this.moreGamesBtn.setText('more_games');
    }

    private openMoreGamesMenu(): void {
        this.game.world.bringToTop(this.moreGamesMenu);
        this.moreGamesMenu.show();
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
        this.logo.alignIn(this.world.bounds, Phaser.CENTER, 0, -100 * Constants.GAME_SCALE);

        //Do the same for the the buttons
        this.testImgBtn.updateScaling(assetsScaling);
        this.testImgBtn.x = this.logo.x / 2;
        this.testImgBtn.y = this.logo.y + this.logo.height * 0.9;

        this.testGrBtn.updateScaling(assetsScaling);
        this.testGrBtn.x = this.logo.x + this.logo.x / 2;
        this.testGrBtn.y = this.testImgBtn.y;

        let buttonOffset: number = 10 * Constants.GAME_SCALE;
        this.languageMenu.resize(this.game.width - this.languageMenu.width * 0.5 - buttonOffset, this.musicBtn.height * 0.5 + buttonOffset, assetsScaling);

        this.musicBtn.scale.set(assetsScaling);
        this.musicBtn.x = this.languageMenu.x - (this.languageMenu.width + this.musicBtn.width) * 0.5 - buttonOffset;
        this.musicBtn.y = this.languageMenu.y;

        this.sfxBtn.scale.set(assetsScaling);
        this.sfxBtn.x = this.musicBtn.x - (this.musicBtn.width + this.sfxBtn.width) * 0.5 - buttonOffset;
        this.sfxBtn.y = this.languageMenu.y;

        this.brandingLogo.y = this.game.height - this.brandingLogo.height * 1.5;
        this.moreGamesBtn.updateScaling(assetsScaling * 0.75);
        this.moreGamesBtn.x = this.game.width - this.moreGamesBtn.width * 0.9;
        this.moreGamesBtn.y = this.game.height - this.moreGamesBtn.height * 0.75;
    }

    public shutdown(): void {
        super.shutdown();

        this.background = null;
        this.logo = null;
        this.testImgBtn = null;
        this.testGrBtn = null;
        this.sfxBtn = null;
        this.musicBtn = null;
    }
}
