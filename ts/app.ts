module BoilerPlate
{
    export class Game extends Phaser.Game
    {
        private static instance: Game = null;

        constructor()
        {
            super({
                enableDebug: false,
                width: Constants.GAME_WIDTH,
                height: Constants.GAME_HEIGHT,
                renderer: Phaser.AUTO,
                parent: 'boilerplate',
                transparent: true,
                antialias: true,
                preserveDrawingBuffer: false,
                physicsConfig: null,
                seed: '',
                state: null
            });

            //We run Boot immediatly because it will configure the game accordingly, this does not start the game!
            this.state.add(Fabrique.Boot.Name, Fabrique.Boot, true);

            //Here we load all the states, but they shouldn't start automaticly
            this.state.add(Fabrique.Splash.Name, Fabrique.Splash, false);
            this.state.add(Menu.Name, Menu, false);

            /**
             * Load plugin when Game is initialized, this gets added to the ready Queue of which Engine initialisation is the first
             */
            Phaser.Device.whenReady(() => {
                this.plugins.add(Fabrique.Plugins.GameEvents);
                this.plugins.add(Fabrique.Plugins.GoogleAnalytics);
                this.plugins.add(Fabrique.Plugins.GameAnalytics);
                this.plugins.add(Fabrique.Plugins.CacheBuster);
            });
        }

        /**
         * We make
         *
         * @returns {Game}
         */
        public static getInstance(): Game
        {
            if (null === Game.instance) {
                Game.instance = new Game();
            }

            return Game.instance;
        }

        public start(analyticsUser:GA.User):void
        {
            //Load the fonts
            WebFont.load(<WebFont.Config>{
                custom: <WebFont.Custom>{
                    families: ['Aller Display'],
                    urls: [
                        'assets/css/AllerDisplay.css'
                    ]
                },
                active: () => {
                    //start the game
                    this.state.start(
                        Fabrique.Splash.Name,
                        true,
                        false,
                        <Fabrique.ISplashConfic> {
                            bgColor: Constants.SPLASH_BACKGROUND,
                            image: Constants.SPLASH_IMAGE,
                            clickUrl: Constants.SPLASH_URL,
                            nextState: Menu.Name
                        }
                    );
                }
            });
        }
    }
}