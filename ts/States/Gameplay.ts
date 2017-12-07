module BoilerPlate {
    export class Gameplay extends Phaser.State implements Fabrique.IState  {
        public static Name: string = 'gameplay';
        public static pause: boolean = false;

        public name: string = Gameplay.Name;
        public game: Fabrique.IGame;

        private background: Phaser.Image;
        private text: Label;
        private backBtn: LabeledButton;

        constructor() {
            super();
        }

        public init(): void {
            this.game.world.removeAll();

            //Play background music
            SoundManager.getInstance().playMusic(Sounds.GameMusic);
        }

        public create(): void {
            super.create();

            //Send a screen view to Google to track different states
            // this.game.analytics.google.sendScreenView(this.name);

            this.background = this.game.add.image(0, 0, Atlases.Interface, 'bg_blue');

            let textStyle: any = {font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial', fill: '#FFFFFF'};

            this.text = new Label(this.game, 0, 0, 'This is the GAMEPLAY state.', textStyle);

            this.backBtn = new LabeledButton(this.game, 0, 0, 'BACK', textStyle, this.startMenu, this, 300, 100);
            this.backBtn.setFrames('btn_blue', 'btn_blue', 'btn_blue_onpress', 'btn_blue');

            this.resize();
        }

        private startMenu(): void {
            this.game.state.add(Menu.Name, Menu, true);
        }

        /**
         * Called every time the rotation or game size has changed.
         * Rescales and repositions the objects.
         */
        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;

            this.text.alignIn(this.world.bounds, Phaser.CENTER);

            this.backBtn.x = this.game.width / 2;
            this.backBtn.y = this.text.y + this.text.height + this.backBtn.height;
        }

        public shutdown(): void {
            super.shutdown();

            this.background = null;
            this.text = null;
            this.backBtn = null;
        }
    }
}
