module BoilerPlate {
    export class Boot extends Phaser.State implements Fabrique.IState {
        public static Name: string = 'boot';

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

            //Tell google we're watching this state
            this.game.analytics.google.sendScreenView('boot');

            //input pointers limited to 1
            this.game.input.maxPointers = 1;

            //Disable contextual menu
            this.game.canvas.oncontextmenu = function (e: Event): void {
                e.preventDefault();
            };

            //Set up ads
            this.game.ads.setAdProvider(new Fabrique.AdProvider.Ima3(
                this.game,
                'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/2392211/fbrq_ingame&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1'
            ));

            //Enable scaling
            if ( this.game.device.desktop ) {
                //For desktop we keep aspect ratio because it looks nicer
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

        public mobileResizeCallback(manager: Phaser.ScaleManager): void {
            let width: number = window.innerWidth;
            let height: number = window.innerHeight;

            let scaleFactor: number = 1;

            //So first we check if the game is beeing played in landscape
            if (width > height) {
                //Now we'll check if the current aspect ratio is higher or lower than the game's original aspect ratio
                if (width / height < Constants.GAME_WIDTH / Constants.GAME_HEIGHT) {
                    //If the aspect ratio is smaller than what we expect, we scale the game based on it's width
                    scaleFactor /= width / Constants.GAME_WIDTH;
                } else {
                    //But if the aspect ratio is higher, than scaling will happen on height, making sure the game will always correctly fit
                    scaleFactor /= height / Constants.GAME_HEIGHT;
                }
            } else {
                //And now we do the same for portrait, but we inverse with/height, because p[ortrait =)
                if (height / width < Constants.GAME_WIDTH / Constants.GAME_HEIGHT) {
                    //If the aspect ratio is smaller than what we expect, we scale the game based on it's width
                    scaleFactor /= width / Constants.GAME_HEIGHT;
                } else {
                    //But if the aspect ratio is higher, than scaling will happen on height, making sure the game will always correctly fit
                    scaleFactor /= height / Constants.GAME_WIDTH;
                }
            }

            if (manager.width !== width * scaleFactor || manager.height !== height * scaleFactor) {
                manager.setGameSize(width * scaleFactor, height * scaleFactor);
                manager.setUserScale(1 / scaleFactor, 1 / scaleFactor);
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
        }

        public create(): void {
            this.game.state.start(Fabrique.SplashScreen.Preloader.Name, true, false, {
                nextState: Menu.Name,
                mobilePlayClickhandler: (): void => {
                    this.game.ads.onContentPaused.addOnce((): void => {
                        //Tell google we're watching an ad
                        this.game.analytics.google.sendScreenView('advertisement');
                    });

                    this.game.ads.onContentResumed.addOnce((): void => {
                        this.game.state.start(Menu.Name);
                    });

                    this.game.ads.showAd({
                        internal: (Fabrique.Branding.isInternal(this.game)) ? 'YES' : 'NO',
                        gameID: 999, //change this to gameid
                        pub: Fabrique.Utils.getSourceSite(),
                        ad: 'preroll'
                    });
                },

                preloadHandler: (): void => {
                    //Tell google we're watching the splash screen
                    this.game.analytics.google.sendScreenView('splash');

                    let i: number;

                    //We can disable visability change here, because the click listener was added to catch the faulty websites
                    this.game.stage.disableVisibilityChange = false;
                    this.game.sound.muteOnPause = true;

                    //Preload branding logo and moregames menu
                    Fabrique.Branding.preloadImages(this.game);
                    Fabrique.MoreGames.Menu.preloadImages(this.game);

                    for (i = 0; i < Images.preloadList.length; i++) {
                        this.game.load.image(Images.preloadList[i], 'assets/images/' + Images.preloadList[i] + '.png');
                    }
                    for (i = 0; i < Atlases.preloadList.length; i++) {
                        this.game.load.atlas(Atlases.preloadList[i], 'assets/atlases/' + Atlases.preloadList[i] + '.png', 'assets/atlases/' + Atlases.preloadList[i] + '.json');
                    }

                    Sounds.preloadList.forEach((assetName: string) => {
                        if (this.game.device.iOS) {
                            this.game.load.audio(assetName, ['assets/sound/' + assetName + '.m4a']);
                        } else {
                            this.game.load.audio(assetName, ['assets/sound/' + assetName + '.ogg', 'assets/sound/' + assetName + '.mp3']);
                        }
                    });
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

                this.game.analytics.google.sendGenericEvent('Game Orientation Switched', orientation, 'Times Switched: ' + this.orientationSwitchCounter.toString());
            } else {
                let orientation: string = isPortrait ? 'Portrait' : 'Landscape';
                this.game.analytics.google.sendGenericEvent('Game Orientation', orientation);

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
