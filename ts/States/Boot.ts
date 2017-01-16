module BoilerPlate {
    export class Boot extends Phaser.State implements Fabrique.IState {
        public static Name: string = 'booter';
        public static inGame: boolean = false;
        public static pause: boolean = false;

        public name: string = Boot.Name;
        public game: Fabrique.IGame;

        private wasPaused: boolean;

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

            //input pointers limited to 1
            this.game.input.maxPointers = 1;

            //Disable contextual menu
            this.game.canvas.oncontextmenu = function (e: Event): void {
                e.preventDefault();
            };

            //Game is not paused when losing focus from window/tab
            this.stage.disableVisibilityChange = true;

            //Enable scaling
            if (this.game.device.desktop) {
                this.stage.disableVisibilityChange = true;
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.pageAlignHorizontally = true;
                this.game.scale.windowConstraints.bottom = 'visual';
            } else {
                //Set assets scaling for mobile devices
                Constants.GAME_SCALE = this.getScaling();

                this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;

                //Resize because it's better than any of the Phaser provided resizes
                window.addEventListener('resize', (e: Event) => Boot.mobileResizeCallback(this.game.scale));
                this.game.scale.onSizeChange.add(
                    () => {
                        if (Constants.LANDSCAPE_LOCKED) {
                            if (this.game.width > this.game.height) {
                                this.handleCorrect();
                            } else {
                                this.handleIncorrect();
                            }
                        } else if (Constants.PORTRAIT_LOCKED) {
                            if (this.game.width < this.game.height) {
                                this.handleCorrect();
                            } else {
                                this.handleIncorrect();
                            }
                        }
                        this.game.state.getCurrentState().resize();
                    },
                    this
                );
                Boot.mobileResizeCallback(this.game.scale);
            }
        }

        /**
         * Called every time the orientation on mobile device changes.
         * @param manager
         */
        public static mobileResizeCallback(manager: Phaser.ScaleManager): void {
            let width: number = window.innerWidth;
            let height: number = window.innerHeight;

            let usedWidth: number = Constants.GAME_ORIGINAL_WIDTH * Constants.GAME_SCALE;
            let usedHeight: number = Constants.GAME_ORIGINAL_HEIGHT * Constants.GAME_SCALE;

            let scaleFactor: number = 1;

            //Check if the game is being played in landscape
            if (width > height) {
                if (width / height < 1.5 && Boot.inGame || width / height > 1.8) {
                    scaleFactor /= height / usedHeight;
                } else {
                    scaleFactor /= width / usedWidth;
                }
            } else {
                scaleFactor /= height / usedHeight;
            }

            if (manager.width !== width * scaleFactor || manager.height !== height * scaleFactor) {
                //Calculate the new size
                Constants.GAME_WIDTH = Math.ceil(width * scaleFactor);
                Constants.GAME_HEIGHT = Math.ceil(height * scaleFactor);

                //Set the new size and scaling factor
                manager.setGameSize(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
                manager.setUserScale(1 / scaleFactor, 1 / scaleFactor);
            }
        }

        /**
         * Load all the assets needed for the preloader before starting the game.
         * First load cachebuster before running Splash screen preloader.
         * The preloader will load all the assets while displaying portal specific splash screen.
         */
        public preload(): void {
            this.game.load.cacheBuster = (typeof version === 'undefined') ? null : version;

            this.game.state.start(Fabrique.SplashScreen.Preloader.Name, true, false, {
                nextState: Preloader.Name,          //TODO: If you DO want a custom preloader, uncomment this line
                // nextState: Menu.Name,            //TODO: If you DON'T want a custom preloader, uncomment this line and preload the assets lists in the Boot or in the Menu states
                preloadTexts: [
                    'Loading assets...'
                ],
                preloadHandler: (): void => {
                    //Load the assets based on the game scale.
                    let scale: string = 'x' + Constants.GAME_SCALE + '/';

                    Images.preloadList.forEach((assetName: string) => {
                        this.game.load.image(assetName, 'assets/images/' + scale + assetName + '.png');
                    });

                    Atlases.preloadList.forEach((assetName: string) => {
                        this.game.load.atlas(assetName, 'assets/atlases/' + scale + assetName + '.png', 'assets/atlases/' + scale + assetName + '.json');
                    });

                    Sounds.preloadList.forEach((assetName: string) => {
                        if (this.game.device.iOS) {
                            this.game.load.audio(assetName, ['assets/sound/' + assetName + '.m4a']);
                        } else {
                            this.game.load.audio(assetName, ['assets/sound/' + assetName + '.ogg', 'assets/sound/' + assetName + '.mp3']);
                        }
                    });

                    Fabrique.Branding.preloadImages(this.game);
                }
            });
        }

        /**
         * Hides rotate device image and shows game.
         */
        private handleCorrect(): void {
            if (!this.wasPaused) {
                Gameplay.pause = false;
            }

            document.getElementById('orientation').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        }

        /**
         * Hides game and shows an image asking to rotate device.
         */
        private handleIncorrect(): void {
            this.wasPaused = Gameplay.pause;

            if (!this.wasPaused) {
                Gameplay.pause = true;
            }

            document.getElementById('orientation').style.display = 'block';
            document.getElementById('content').style.display = 'none';
        }

        /**
         * Calculates the right scaling based on the inner size of the window.
         * Only used for mobile devices, because on desktop the default scale is always 1.
         * @returns {number}
         */
        private getScaling(): number {
            let width: number = window.innerWidth;

            //Check if the device is in portrait mode, and if so, override the width with the innerHeight.
            //We want to determine the scaling based on the the biggest side.
            if (width < window.innerHeight) {
                width = window.innerHeight;
            }

            let scale: number = 1;
            if (width < 650) {
                scale = 0.5;
            } else if (this.game.scale.game.device.iPad) {
                scale = 1;
            } else {
                scale = 0.75;
            }

            return scale;
        }
    }
}
