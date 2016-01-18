module Fabrique {
    export class State extends Phaser.State {
        public game:Fabrique.Game;

        public static Name:string = 'default';

        public name:string = State.Name;

        public create() {
            this.game.analytics.google.sendScreenView(this.name);
        }
    }
}