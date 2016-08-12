module Fabrique {
    export interface IBackendGame {
        gameover: boolean;
        score: number;
        success: boolean;
        config?: {};
    }

    export class BackendGame implements Fabrique.IBackendGame {
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
