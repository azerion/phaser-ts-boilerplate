module BoilerPlate {
    export class Boot extends Phaser.State implements Fabrique.IState {
        public static Name: string = 'booter';

        public name: string = Boot.Name;

        public game: Fabrique.IGame;

        private orientationTracked: boolean = false;

        private orientationSwitchCounter: number = 0;

        constructor() {
            super();
        }

        /**
         * Init, this is where game and google analytics are set up.
         * Small tweaks such as limiting input pointers, disabling right click context menu are placed here
         */

        public init(): void {
            //Setup analytics
           /* this.game.analytics.game.setup(Constants.GAME_KEY, Constants.SECRET_KEY, version, this.game.analytics.game.createUser());
            let sessionTime: number = Date.now();
            window.addEventListener('beforeunload', () => {
                this.game.analytics.game.addEvent(new GA.Events.SessionEnd((Date.now() - sessionTime) / 1000));
                this.game.analytics.game.sendEvents();
            });

            this.game.analytics.google.setup(Constants.GOOGLE_ID, Constants.GOOGLE_APP_NAME, version);*/

            //Small fixes and tweaks are placed below

            // input pointers limited to 1
            this.game.input.maxPointers = 1;

            //Disable contextual menu
            this.game.canvas.oncontextmenu = function (e: Event): void {
                e.preventDefault();
            };

            // Game is not paused when losing focus from window/tab
            this.stage.disableVisibilityChange = true;

            //Enable scaling
            if ( this.game.device.desktop ) {
                this.stage.disableVisibilityChange = true;
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.pageAlignHorizontally = true;
                this.game.scale.windowConstraints.bottom = 'visual';
            } else {
                this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                //resize because it's better than any of the phaser provided resizes
                window.addEventListener('resize', (e: Event) => this.mobileResizeCallback(this.game.scale));
                this.game.scale.onSizeChange.add(
                    () => {
                        this.game.state.getCurrentState().resize();
                    },
                    this
                );
                this.mobileResizeCallback(this.game.scale);
            }
        }

        public mobileResizeCallback(manager: Phaser.ScaleManager): void {
            let userRatio: number = 1;
            if ( this.game.device.pixelRatio > 1 ) {
                //If you are finding you game is lagging on high density displays then change the value to a low number (0.75 for example)
                userRatio = this.game.device.pixelRatio * 0.2;
            }
            userRatio /= Math.round(window.innerWidth / Constants.GAME_WIDTH * 10) / 10;
            if ( manager.width !== window.innerWidth * userRatio || manager.height !== window.innerHeight * userRatio ) {
                manager.setGameSize(window.innerWidth * userRatio, window.innerHeight * userRatio);
                manager.setUserScale(1 / userRatio, 1 / userRatio);
            }

            this.checkOrientation();
        }

        /**
         * Preload, loads all the assets before starting the game
         * First load cachebuster before running Splashscreen preloader
         * The preloader will load all the assets while displaying portal specific splashscreen
         */

        public preload(): void {
            this.game.load.cacheBuster = (typeof version === 'undefined') ? null : version;

            this.game.state.start(Fabrique.SplashScreen.Preloader.Name, true, false, {
                nextState: Menu.Name,
                preloadTexts: [
                    'Calculating puzzles',
                    'Drawing fields',
                    'Setting up numbers'
                ],
                preloadHandler: (): void => {
                    let i: number;
                    for (i = 0; i < Images.preloadList.length; i++) {
                        this.game.load.image(Images.preloadList[i], 'assets/images/' + Images.preloadList[i] + '.png');
                    }
                    for (i = 0; i < Atlases.preloadList.length; i++) {
                        this.game.load.atlas(Atlases.preloadList[i], 'assets/atlases/' + Atlases.preloadList[i] + '.png', 'assets/atlases/' + Atlases.preloadList[i] + '.json');
                    }

                    Sounds.preloadList.forEach((assetName: string) => {
                        if ( this.game.device.iOS ) {
                            this.game.load.audio(assetName, ['assets/sound/' + assetName + '.m4a']);
                        }
                        this.game.load.audio(assetName, ['assets/sound/' + assetName + '.ogg', 'assets/sound/' + assetName + '.mp3']);
                    });

                    Fabrique.Branding.preloadImages(this.game);
                }
            });
        }

        /**
         * Checks orientation, if game is being played on a mobile device, checks if it is portrati or landscape mode         *
         */

        private checkOrientation(): void {
            let w: number = document.getElementById('dummy').getBoundingClientRect().left;
            let h: number = document.getElementById('dummy').getBoundingClientRect().top;

            if ( w > h && h < 300 ) {
                this.enterIncorrectOrientation();
            } else {
                this.leaveIncorrectOrientation();
            }

            this.trackOrientation(h > w);
        }

        /**
         * Checks orientation changes
         * Send google analytics to track number of times user switches between landscape and portrait
         * @param isPortrait
         */

        private trackOrientation(isPortrait: boolean): void {
            if ( this.orientationTracked ) {
                let orientation: string = isPortrait ? 'toPortrait' : 'toLandscape';
                this.orientationSwitchCounter++;

                ga('send', 'event', 'Game Orientation Switched', orientation, 'Times Switched: ' + this.orientationSwitchCounter.toString());
            } else {
                let orientation: string = isPortrait ? 'Portrait' : 'Landscape';
                ga('send', 'event', 'Game Orientation', orientation);

                this.orientationTracked = true;
            }
        }

        /**
         * Hides game and shows an image asking to rotate device to landscape mode
         */

        private enterIncorrectOrientation(): void {
            document.getElementById('orientation').style.display = 'block';
            document.getElementById('content').style.display = 'none';
        }

        /**
         * Hides rotate deivce image and shows game
         */

        private leaveIncorrectOrientation(): void {
            document.getElementById('orientation').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        }
    }
}
