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
            this.game.analytics.game.setup(Constants.GAME_KEY, Constants.SECRET_KEY, version, this.game.analytics.game.createUser());
            let sessionTime: number = Date.now();
            window.addEventListener('beforeunload', () => {
                this.game.analytics.game.addEvent(new GA.Events.SessionEnd((Date.now() - sessionTime) / 1000));
                this.game.analytics.game.sendEvents();
            });

            this.game.analytics.google.setup(Constants.GOOGLE_ID, Constants.GOOGLE_APP_NAME, version);

            //Small fixes and tweaks are placed below

            //input pointers limited to 1
            this.game.input.maxPointers = 1;

            //Disable contextual menu
            this.game.canvas.oncontextmenu = function (e: Event): void {
                e.preventDefault();
            };

            //Set up ads
            this.game.ads.setAdProvider(new PhaserAds.AdProvider.GameDistributionAds(
                this.game,
                Constants.GAMEDISTRIBUTION_ID,
                Constants.GAMEDISTRIBUTION_USER
            ));

            //Enable scaling
            if (this.game.device.desktop) {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.pageAlignHorizontally = true;
                this.game.scale.windowConstraints.bottom = 'visual';

                this.game.onBlur.add((data: any) => {
                    this.game.sound.mute = true;
                });
                this.game.onFocus.add((data: any) => {
                    this.game.sound.mute = false;
                });
            } else {
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

                if (Fabrique.Utils.isOnDevice(this.game)) {
                    //game pause/focus events only go for the game canvas, we need to check if the entire document is paused due to ads
                    document.addEventListener('pause', () => {
                        this.game.sound.mute = true;
                    });
                    document.addEventListener('resume', () => {
                        this.game.sound.mute = false;
                    });
                } else {
                    this.stage.disableVisibilityChange = false;
                    this.game.onPause.add((data: any) => {
                        this.game.sound.mute = true;
                    });
                    this.game.onResume.add((data: any) => {
                        this.game.sound.mute = false;
                    });
                }
            }
        }

        /**
         * Called every time the orientation on mobile device changes.
         * @param manager
         */
        public static mobileResizeCallback(manager: Phaser.ScaleManager): void {
            let width: number = window.innerWidth;
            let height: number = window.innerHeight;

            Boot.setScaling(manager.game);

            let usedWidth: number = Constants.GAME_WIDTH * Constants.GAME_SCALE;
            let usedHeight: number = Constants.GAME_HEIGHT * Constants.GAME_SCALE;

            let scaleFactor: number = 1;

            //So first we check if the game is beeing played in landscape
            if (width > height) {
                scaleFactor /= height / usedHeight;
            } else {
                scaleFactor /= height / usedWidth;
            }

            Constants.CALCULATED_WIDTH = Math.ceil(width * scaleFactor);
            Constants.CALCULATED_HEIGHT = Math.ceil(height * scaleFactor);

            manager.setGameSize(Constants.CALCULATED_WIDTH, Constants.CALCULATED_HEIGHT);
            manager.setUserScale(1 / scaleFactor, 1 / scaleFactor);
        }

        /**
         * Calculates the right scaling based on the inner size of the window.
         * Only used for mobile devices, because on desktop the default scale is always 1.
         * @returns {number}
         */
        private static setScaling(game: Phaser.Game): void {
            //Check if the device is in portrait mode, and if so, override the width with the innerHeight.
            //We want to determine the scaling based on the the biggest side.
            let width: number = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;
            width *= game.device.pixelRatio;

            if (width < 650) {
                Constants.GAME_SCALE = 0.5;
            } else if (width > 1050) {
                Constants.GAME_SCALE = 1;
            } else {
                Constants.GAME_SCALE = 0.75;
            }
        }

        public preload(): void {
            this.game.load.cacheBuster = (typeof version === 'undefined') ? null : version;

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
                    this.game.load.audio(assetName, ['assets/sounds/' + assetName + '.m4a']);
                } else {
                    this.game.load.audio(assetName, ['assets/sounds/' + assetName + '.ogg', 'assets/sounds/' + assetName + '.mp3']);
                }
            });
        }

        /**
         * Load all the assets needed for the preloader before starting the game.
         * First load cachebuster before running Splash screen preloader.
         * The preloader will load all the assets while displaying portal specific splash screen.
         */
        public create(): void {
            Fabrique.LoaderHelper.hide();
            //TODO: If you DO want a custom preloader, uncomment this line
            //this.game.state.start(Preloader.Name);

            //TODO: If you DON'T want a custom preloader, uncomment this piece and preload the assets lists in the Boot or in the Menu states
            this.game.state.start(Fabrique.SplashScreen.Preloader.Name, true, false, {
                nextState: Menu.Name,
                mobilePlayClickhandler: (): void => {
                    Fabrique.LoaderHelper.show();
                    this.game.ads.onContentPaused.addOnce((): void => {
                        Fabrique.LoaderHelper.hide();
                        this.game.analytics.google.sendScreenView('advertisement');
                    });

                    this.game.ads.onContentResumed.addOnce((): void => {
                        Fabrique.LoaderHelper.hide();
                        this.game.state.start(Menu.Name);
                        this.game.ads.onContentPaused.removeAll();
                        this.game.ads.onContentResumed.removeAll();
                    });

                    this.game.ads.showAd();
                },
                preloadHandler: (): void => {
                    this.game.sound.muteOnPause = true;

                    //Load the assets based on the game scale.
                    let scale: string = 'x' + Constants.GAME_SCALE + '/';

                    Images.list.forEach((assetName: string) => {
                        this.game.load.image(assetName, 'assets/images/' + scale + assetName + '.png');
                    });

                    Atlases.list.forEach((assetName: string) => {
                        this.game.load.atlas(assetName, 'assets/atlases/' + scale + assetName + '.png', 'assets/atlases/' + scale + assetName + '.json');
                    });

                    Sounds.list.forEach((assetName: string) => {
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
    }
}
