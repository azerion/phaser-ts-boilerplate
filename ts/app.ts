module BoilerPlate
{
    export class Game extends Phaser.Game
    {
        constructor()
        {
            super(Constants.GAME_WIDTH, Constants.GAME_HEIGHT, Phaser.AUTO, 'og-fabrique-boilerplate', null, false, true);

            this.state.add(Boot.Name, Boot, false);
            this.state.add(Loader.Name, Loader, false);
        }

        public start(): void
        {
            this.state.start(Boot.Name);
        }
    }
}

function startGame() {
    var started: boolean = false;
    var triggeredErrors: string[] = [];

    window.addEventListener('error', (event:ErrorEvent) => {
        if (triggeredErrors.indexOf(event.message) !== -1) {
            return;
        }

        triggeredErrors.push(event.message);

        var message = "Error: " + event.message;
        if (event.filename) {
            message += "\nurl: " + event.filename;
        }
        if (event.lineno) {
            message += "\nline: " + event.lineno;
        }
        if (event.colno) {
            message  += "\ncolumn:" + event.colno;
        }
        if (event.error) {
            message +=  '\nDetails' + event.error;
        }

        GA.getInstance()
            .addEvent(new GA.Events.Exception(GA.Events.ErrorSeverity.critical, message))
            .sendData();
    });

    window.addEventListener('error', (event:ErrorEvent) => {
        var stack = event.message;

        if (event.hasOwnProperty('error') && event.error.hasOwnProperty('stack')) {
            stack = event.error.stack;
        }

        GA.getInstance()
            .addEvent(new GA.Events.Exception(GA.Events.ErrorSeverity.critical, stack))
            .sendData();
    });

    var game = new BoilerPlate.Game();

    //Load the font
    WebFont.load(<WebFont.Config>{
        custom: <WebFont.Custom>{
            families: ['Aller Display', 'Lobster'],
            urls: [
                'assets/css/AllerDisplay.css',
                'assets/css/Lobster.css'
            ]
        },
        active: () => game.start()//start the game here!
    });
};
