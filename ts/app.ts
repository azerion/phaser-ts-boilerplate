module BoilerPlate {
    export class Game extends Phaser.Game {
        private static instance: Game = null;

        constructor() {
            super({
                enableDebug: false,
                width: Constants.GAME_WIDTH,
                height: Constants.GAME_HEIGHT,
                renderer: Phaser.AUTO,
                parent: 'content',
                transparent: true,
                antialias: true,
                preserveDrawingBuffer: false,
                physicsConfig: null,
                seed: '',
                state: null
            });

            //Here we load all the states, but they shouldn't start automaticly
            this.state.add(Boot.Name, Boot, false);
            this.state.add(Preload.Name, Preload, false);
            this.state.add(Menu.Name, Menu, false);
            /**
             * Load plugin when Game is initialized, this gets added to the ready Queue of which Engine initialisation is the first
             */
            Phaser.Device.whenReady(() => {
                this.plugins.add(Fabrique.Plugins.GameEvents);
                this.plugins.add(Fabrique.Plugins.GoogleAnalytics);
                this.plugins.add(Fabrique.Plugins.GameAnalytics);
                this.plugins.add(Fabrique.Plugins.Responsiveness);
                this.plugins.add(Fabrique.Plugins.CacheBuster);
                this.plugins.add(Fabrique.Plugins.Spine);
            });
        }

        /**
         * We make
         *
         * @returns {Game}
         */
        public static getInstance(): Game {
            if (null === Game.instance) {
                Game.instance = new Game();
            }

            return Game.instance;
        }

        public start(): void {
            //Load the fonts
            WebFont.load(<WebFont.Config>{
                custom: <WebFont.Custom>{
                    families: ['Aller Display'],
                    urls: [
                        'assets/css/AllerDisplay.css'
                    ]
                },
                active: (): void => {
                    //start the game
                    this.state.start(Boot.Name);
                }
            });
        }
    }
}
