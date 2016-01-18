module Fabrique {
    export class BackendGame {
        public gameover:boolean = false;
        public score:number = 0;
        public success:boolean = false;

        constructor() {
        }

        public handleGameMove(command:any) {
        }

        public generateResponse():any {
            var response = {
                score: this.score,
                gameover: this.gameover,
                success: this.success,
                config: {}
            };

            return response;
        }
    }
}