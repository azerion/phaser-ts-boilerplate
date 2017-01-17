module BoilerPlate {
    export class Menu extends Phaser.State implements Fabrique.IState  {
        public static Name: string = 'menu';

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
            let logo: Phaser.Image = Fabrique.Branding.getLogoWithLink(this.game, 'boilerplate');
            logo.x = Constants.GAME_WIDTH / 2;
            logo.y = Constants.GAME_HEIGHT / 2 - 200;
            logo.anchor.set(0.5);
            logo.scale.set(0.4);
            this.game.add.existing(logo);

            let button: Phaser.Button = this.game.add.button(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2 - 50, Images.BtnBlue, ():  void => {
                this.moreGamesMenu.show();
            });
            button.anchor.set(0.5);

            let button2: Phaser.Button = this.game.add.button(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2 + 50, Images.BtnBlue, ():  void => {
                this.game.ads.onContentPaused.addOnce((): void => {
                    //Tell google we're watching an ad
                    this.game.analytics.google.sendScreenView('advertisement');
                });

                this.game.ads.onContentResumed.addOnce((): void => {
                    //Do some stuff here
                });

                this.game.ads.showAd({
                    internal: (Fabrique.Branding.isInternal(this.game)) ? 'YES' : 'NO',
                    gameID: 999, //change this to gameid
                    pub: Fabrique.Utils.getSourceSite(),
                    ad: 'midrollroll'
                });
            });
            button2.anchor.set(0.5);

            this.moreGamesMenu = new Fabrique.MoreGames.Menu(this.game, 'gamen-name');
            this.moreGamesMenu.x = this.game.width / 2;
            this.moreGamesMenu.y = this.game.height / 2;
            this.game.add.existing(this.moreGamesMenu);

        }

        public resize(): void {
            this.moreGamesMenu.x = this.game.width / 2;
            this.moreGamesMenu.y = this.game.height / 2;
        }
    }
}
