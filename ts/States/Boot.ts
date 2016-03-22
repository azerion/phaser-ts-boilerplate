module BoilerPlate {
    export class Boot extends Fabrique.State {
        public static Name: string = 'booter';

        public name: string = Boot.Name;

        constructor() {
            super();
        }

        /**
         * Loader, here we load the assets we need in order to show the loader
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

            //Disable contextual menu
            this.game.canvas.oncontextmenu = function (e: Event): void {
                e.preventDefault();
            };

            //Enable scaling
            if (this.game.device.desktop) {
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
            if (this.game.device.pixelRatio > 1) {
                //If you are finding you game is lagging on high density displays then change the value to a low number (0.75 for example)
                userRatio = this.game.device.pixelRatio * 0.2;
            }
            userRatio /= Math.round(window.innerWidth / Constants.GAME_WIDTH * 10) / 10;
            if (manager.width !== window.innerWidth * userRatio || manager.height !== window.innerHeight * userRatio) {
                manager.setGameSize(window.innerWidth * userRatio, window.innerHeight * userRatio);
                manager.setUserScale(1 / userRatio, 1 / userRatio);
            }

            this.checkOrientation();
        }

        public preload(): void {
            this.game.load.cacheBuster = (typeof version === 'undefined') ? null : version;
        }

        public create(): void {
            this.game.state.start(Preload.Name);
        }

        private checkOrientation(): void {
            let w: number = document.getElementById('dummy').getBoundingClientRect().left;
            let h: number = document.getElementById('dummy').getBoundingClientRect().top;

            if (w > h && h < 300) {
                this.enterIncorrectOrientation();
            } else {
                this.leaveIncorrectOrientation();
            }
        }

        private enterIncorrectOrientation(): void {
            document.getElementById('orientation').style.display = 'block';
            document.getElementById('content').style.display = 'none';
        }

        private leaveIncorrectOrientation(): void {
            document.getElementById('orientation').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        }
    }
}
