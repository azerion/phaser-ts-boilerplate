module Fabrique {
    export class State extends Phaser.State {
        public static Name: string = 'default';

        public game: Fabrique.IGame;

        public name: string = State.Name;

        public create(): void {
            this.game.analytics.google.sendScreenView(this.name);
        }
    }
}
