/// <reference path="../Fabrique/Objects/Game.ts" />
/**
 * Interface Fabrique.Backend uses IBackend Interface which has score, success and gameover properties *
 */
module BoilerPlate {
    export class Backend implements Fabrique.IBackendGame {
        public gameover: boolean = false;
        public score: number = 0;
        public success: boolean = false;

        public generateResponse(): Fabrique.IBackendGame {
            let response: Fabrique.IBackendGame = {
                score: this.score,
                gameover: this.gameover,
                success: this.success,
                config: {}
            };

            return response;
        }
    }
}
