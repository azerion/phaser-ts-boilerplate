module BoilerPlate {
    export class Menu extends Phaser.State implements Fabrique.IState  {
        public static Name: string = 'menu';

        public game: Fabrique.IGame;

        public name: string = Menu.Name;

        private moreGamesMenu: Fabrique.MoreGames.Menu;

        constructor() {
            super();
        }

        public create(): void {
            super.create();

            //Tell google we're watching an ad
            this.game.analytics.google.sendScreenView('menu');

            //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            let logo: Phaser.Image = this.game.add.image(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2, Images.Logo);
            logo.anchor.set(0.5);

            let button: Phaser.Button = this.game.add.button(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT - 50, Images.BtnBlue, ():  void => {
                this.moreGamesMenu.show();
            });
            button.anchor.set(0.5);

            this.moreGamesMenu = new Fabrique.MoreGames.Menu(this.game, 'gamen-name');
            this.moreGamesMenu.x = this.game.width / 2;
            this.moreGamesMenu.y = this.game.height/ 2;
            this.game.add.existing(this.moreGamesMenu);

        }

        public resize(): void {
            this.moreGamesMenu.x = this.game.width / 2;
            this.moreGamesMenu.y = this.game.height/ 2;
        }
    }
}
