module Fabrique {
    export class Boot extends Fabrique.State {
        public static Name:string = 'booter';

        public name:string = Boot.Name;

        constructor() {
            super();
        }

        /**
         * Loader, here we load the assets we need in order to show the loader
         */
        public init() {
            //Setup analytics
            this.game.analytics.game.setup(Constants.GAME_KEY, Constants.SECRET_KEY, Constants.BUILD, this.game.analytics.game.createUser());
            this.game.analytics.google.setup(Constants.GOOGLE_ID, Constants.GOOGLE_APP_NAME, Constants.BUILD);

            //Disable contextual menu
            this.game.canvas.oncontextmenu = function (e) {
                e.preventDefault();
            };

            //Enable scaling
            if (this.game.device.desktop) {
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.game.scale.windowConstraints.bottom = true;
            } else {
                //TODO: make this work
                this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                this.game.scale.windowConstraints.bottom = true;
                //this.scale.setResizeCallback(this.scaleMobile, this);
            }

        }
    }
}