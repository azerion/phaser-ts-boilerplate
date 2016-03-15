module Fabrique {
    export class BackendGame {
        public gameover: boolean = false;
        public score: number = 0;
        public success: boolean = false;

        public generateResponse(): any {
            let response: any = {
                score: this.score,
                gameover: this.gameover,
                success: this.success,
                config: {}
            };

            return response;
        }
    }
}
