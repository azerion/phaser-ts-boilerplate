module BoilerPlate {
    export class Gameplay extends Phaser.State implements Fabrique.IState  {
        public static Name: string = 'gameplay';
        public static pause: boolean = false;

        public name: string = Gameplay.Name;
        public game: Fabrique.IGame;

        private background: Phaser.Image;
        private text: Label;

        constructor() {
            super();
        }

        public init(): void {
            this.game.world.removeAll();
        }

        public create(): void {
            super.create();

            //Send a screen view to Google to track different states
            // this.game.analytics.google.sendScreenView(this.name);

            this.background = this.game.add.image(0, 0, Atlases.Interface, 'bg_gameplay');

            this.text = new Label(this.game, 0, 0, 'This is the GAMEPLAY state.', {
                font: 'bold ' + 30 * Constants.GAME_SCALE + 'px Arial',
                fill: '#ffffff'
            });

            this.resize();
        }

        /**
         * Called every time the rotation or game size has changed.
         * Rescales and repositions the objects.
         */
        public resize(): void {
            this.background.width = this.game.width;
            this.background.height = this.game.height;

            this.text.alignIn(this.world.bounds, Phaser.CENTER);
        }
    }
}
