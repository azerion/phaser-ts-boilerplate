module BoilerPlate {
    export class Menu extends Phaser.State {
        public static Name: string = 'menu';

        public name: string = Menu.Name;

        constructor() {
            super();
        }

        public init(): void {
            this.game.world.removeAll();
        }

        /**
         * Loader, here we load the assets we need in order to show the loader
         */
        public preload(): void {
            Images.preloadList.forEach((assetName: string) => {
                this.game.load.image(assetName, 'assets/images/' + assetName + '.png');
            });
        }

        public create(): void {
            //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            let logo: Phaser.Image = this.game.add.image(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2, Images.Logo);
            logo.anchor.set(0.5);

            let button: Phaser.Button = this.game.add.button(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT - 50, Images.BtnBlue, ():  void => {
                //Start the game state
            });
            button.anchor.set(0.5);
        }
    }
}
