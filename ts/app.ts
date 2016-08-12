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

            //Here we load all the states, but they shouldn't start automatically
            this.state.add(Boot.Name, Boot, false);
            this.state.add(Fabrique.SplashScreen.Preloader.Name, Fabrique.SplashScreen.Preloader, false);
            this.state.add(Menu.Name, Menu, false);
            /**
             * Load plugin when Game is initialized, this gets added to the ready Queue of which Engine initialisation is the first
             */
            Phaser.Device.whenReady(() => {
                this.plugins.add(Fabrique.Plugins.GameEvents);
                this.plugins.add(Fabrique.Plugins.GoogleAnalytics);
                this.plugins.add(Fabrique.Plugins.GameAnalytics);
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
            if ( null === Game.instance ) {
                Game.instance = new Game();
            }

            return Game.instance;
        }

        /**
         * Starts loading the fonts and starts Boot State
         * The function checks if font is loaded, if not uses substitute font
         *  If loaded, it updates and uses the loaded font
         */

        public start(): void {            
            let updateText: () => void = (): void => {
                this.recursiveUpdateText(this.stage);
            };
            
            //Load the fonts
            WebFont.load(<WebFont.Config>{
                custom: <WebFont.Custom>{
                    families: ['Aller Display'],
                    urls: [
                        'assets/css/AllerDisplay.css'
                    ]
                },
                active: updateText,
                inactive: updateText
            });
            
            this.state.start(Boot.Name);
        }

        public recursiveUpdateText(obj: Phaser.Text | PIXI.DisplayObjectContainer): void {
            if (obj instanceof Phaser.Text) {
                (<any>obj).dirty = true;
            }

            if (obj.children && obj.children.length > 0) {
                obj.children.forEach((child: PIXI.DisplayObjectContainer) => {
                    this.recursiveUpdateText(child);
                });
            }
        }
    }
}
