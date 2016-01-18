module BoilerPlate
{
    export class Menu extends Phaser.State
    {
        public static Name: string = 'menu';

        public name: string = Menu.Name;

        constructor()
        {
            super();
        }

        /**
         * Loader, here we load the assets we need in order to show the loader
         */
        public preload()
        {
            Images.preloadList.forEach((assetName: string) => {
                this.game.load.image(assetName, 'assets/images/' + assetName + '.png');
            });
        }

        public create()
        {
            //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            var logo:Phaser.Image = this.game.add.image(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2, Images.Logo);
            logo.anchor.set(0.5, 0.5);
        }
    }
}