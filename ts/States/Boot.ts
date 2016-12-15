module BoilerPlate {
    export class Boot extends Phaser.State implements Fabrique.IState {
        public static Name: string = 'boot';

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

            //Tell google we're watching this state
            this.game.analytics.google.sendScreenView('boot');

            // input pointers limited to 1
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

            this.checkOrientation();
        }

        /**
         * Preload, loads all the assets before starting the game
         * First load cachebuster before running Splashscreen preloader
         * The preloader will load all the assets while displaying portal specific splashscreen
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
                        if ( this.game.device.iOS ) {
                            this.game.load.audio(assetName, ['assets/sound/' + assetName + '.m4a']);
                        }
                        this.game.load.audio(assetName, ['assets/sound/' + assetName + '.ogg', 'assets/sound/' + assetName + '.mp3']);
                    });
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
    }
}
