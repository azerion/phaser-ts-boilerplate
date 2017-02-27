//Module name should equal the game name
module BoilerPlate {
    export class Game extends Phaser.Game {
        private static instance: Game = null;

        constructor() {
            //We use Phaser's config object to create the game, since this is the only way to disable debugging
            super({
                enableDebug: false,
                width: Constants.GAME_WIDTH,
                height: Constants.GAME_HEIGHT,
                renderer: Phaser.AUTO,
                parent: 'content',
                transparent: false,
                antialias: true,
                preserveDrawingBuffer: false,
                physicsConfig: null,
                seed: '',
                state: null,
                forceSetTimeOut: false
            });

            //Here we load all the states, but they shouldn't start automatically
            this.state.add(Boot.Name, Boot, false);
            this.state.add(Fabrique.SplashScreen.Preloader.Name, Fabrique.SplashScreen.Preloader, false);
            this.state.add(Preloader.Name, Preloader, false);
            this.state.add(Menu.Name, Menu, false);
            this.state.add(Gameplay.Name, Gameplay, false);

            /**
             * Here we adjust some stuff to the game that we need, before any state is beeing run
             */
            Phaser.Device.whenReady(() => {
                //Fix for mobile portals and IE
                this.stage.disableVisibilityChange = true; //This will make sure the game runs out-of-focus
                let event: string = this.device.desktop ? 'click' : 'touchstart';
                document.getElementById('content').addEventListener(event, (e: Event) => {
                    //This will make sure the game will rerun, when focus was lost
                    this.gameResumed(e);
                });

                //Here we load all the states, but they shouldn't start automatically
                this.plugins.add(Fabrique.Plugins.GameEvents);
                this.plugins.add(Fabrique.Plugins.GoogleAnalytics);
                this.plugins.add(Fabrique.Plugins.GameAnalytics);
                this.plugins.add(PhaserAds.AdManager);
                this.plugins.add(<any>PhaserSuperStorage.StoragePlugin);
                this.plugins.add(PhaserCachebuster.CacheBuster);
                this.plugins.add(PhaserSpine.SpinePlugin);
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

            //Start the boot state
            this.state.start(Boot.Name);
        }

        /**
         * This function will set the dirty property to true on all text objects in the current active stage
         *
         * @param obj
         */
        public recursiveUpdateText(obj: Phaser.Text | PIXI.DisplayObjectContainer): void {
            if ( obj instanceof Phaser.Text ) {
                (<any>obj).dirty = true;
            }

            if ( obj.children && obj.children.length > 0 ) {
                obj.children.forEach((child: PIXI.DisplayObjectContainer) => {
                    this.recursiveUpdateText(child);
                });
            }
        }
    }
}
