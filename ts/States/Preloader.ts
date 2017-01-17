module BoilerPlate {
    export class Preloader extends Phaser.State implements Fabrique.IState  {
        public static Name: string = 'game_preloader';

        public name: string = Preloader.Name;
        public game: Fabrique.IGame;

        private background: Phaser.Image;
        private progressBg: Phaser.Image;
        private progressOutline: Phaser.Image;
        private loadingText: Phaser.Text;

        constructor() {
            super();
        }

        public init(): void {
            this.background = this.game.add.image(0, 0, Images.BgPreloader);

            //Create the filling for the progress bar with graphics and then make an image out of it
            let progressBgGr: Phaser.Graphics = this.game.make.graphics(0, 0);
            progressBgGr.beginFill(0x42d9f4, 0.5)
                .drawRoundedRect(0, 0, 300 * Constants.GAME_SCALE, 30 * Constants.GAME_SCALE, 5 * Constants.GAME_SCALE)
                .endFill();
            this.progressBg = this.game.add.image(0, 0, progressBgGr.generateTexture());

            //Create the outline for the progress bar with graphics and then make an image out of it
            let progressOutlineGr: Phaser.Graphics = this.game.make.graphics(0, 0);
            progressOutlineGr.lineStyle(2, 0xffffff)
                .drawRoundedRect(0, 0, progressBgGr.width, progressBgGr.height, 5 * Constants.GAME_SCALE)
                .endFill();
            this.progressOutline = this.game.add.image(0, 0, progressOutlineGr.generateTexture());

            //The text that will inform the user that the game is loading images, sounds, etc
            this.loadingText = this.game.add.text(0, 0,
                'Loading...', {
                    font: 30 * Constants.GAME_SCALE + 'px Arial',
                    fill: '#FFFFFF'
                });
            this.loadingText.smoothed = false;
            this.loadingText.anchor.set(0.5);

            this.resize();
        }

        /**
         * Load the assets we need for the game.
         */
        public preload(): void {
            this.game.load.setPreloadSprite(this.progressBg);

            //Load the assets based on the game scale.
            let scale: string = 'x' + Constants.GAME_SCALE + '/';

            Images.list.forEach((assetName: string) => {
                this.game.load.image(assetName, 'assets/images/' + scale + assetName + '.png');
            });

            Atlases.list.forEach((assetName: string) => {
                this.game.load.atlas(assetName, 'assets/atlases/' + scale + assetName + '.png', 'assets/atlases/' + scale + assetName + '.json');
            });

            Sounds.list.forEach((assetName: string) => {
                if (this.game.device.iOS) {
                    this.game.load.audio(assetName, ['assets/sound/' + assetName + '.m4a']);
                } else {
                    this.game.load.audio(assetName, ['assets/sound/' + assetName + '.ogg', 'assets/sound/' + assetName + '.mp3']);
                }
            });

            this.game.load.onLoadComplete.add(this.decodeAudio, this);
        }

        /**
         * The loading of assets is complete. Decode the audio.
         */
        public decodeAudio(): void {
            this.loadingText.setText('Decoding Sounds...');

            //Do some audio decoding before continuing
            let audioList: Phaser.Sound[] = [];
            Sounds.list.forEach((assetName: string) => {
                audioList.push(this.game.add.audio(assetName));
            });

            this.game.sound.setDecodedCallback(audioList, this.startMenu, this);
        }

        /**
         * Start the main screen.
         */
        private startMenu(): void {
            this.game.state.add(Menu.Name, Menu, true);
        }

        /**
         * Called every time the rotation or game size has changed.
         * Rescales and repositions the objects.
         */
        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;

            //Realign all the assets
            this.loadingText.alignIn(this.world.bounds, Phaser.CENTER, 0, -30 * Constants.GAME_SCALE);
            this.progressOutline.alignIn(this.world.bounds, Phaser.CENTER, 0, 30 * Constants.GAME_SCALE);
            this.progressBg.alignIn(this.world.bounds, Phaser.CENTER, 0, 30 * Constants.GAME_SCALE);
        }
    }
}
