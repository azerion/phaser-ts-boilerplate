/// <reference path="references.ts" />

function init() {
    var started: boolean = false;
    var triggeredErrors: string[] = [];
    var startGame = () => {
        if (started) {
            return;
        }
        started = true;

        //set the languages
        Quartz.i18n.getInstance(config.language, translations);

        //Set mute state based on value from localStorage
        var QS = Quartz.Storage.getInstance().setNamespace(Constants.GAME_ID.toString());
        Quartz.Sound.mute = (QS.get('quartz-mute') === '1') ? true : false;

        QS.set('session-start', Date.now() / 1000 | 0);
        //Init GameAnalytics
        GA.getInstance()
            .init(Constants.GAME_KEY, Constants.SECRET_KEY, Constants.BUILD, analyticsUser)
            .addEvent(new GA.Events.User());

        //Initialize the session
        Quartz.Session.getInstance(Constants.GAME_ID, config.uuId, config.practice, config.loggedIn);

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

        //Initialize the session
        Quartz.Session.getInstance(Constants.GAME_ID, config.uuId, config.practice, config.loggedIn);

        window.addEventListener('error', (event:ErrorEvent) => {
            var stack = event.message;

            if (event.hasOwnProperty('error') && event.error.hasOwnProperty('stack')) {
                stack = event.error.stack;
            }

            GA.getInstance()
                .addEvent(new GA.Events.Exception(GA.Events.ErrorSeverity.critical, stack))
                .sendData();
        });

        //Start the statemanager and add a state
        Quartz.StateManager.getInstance(30, false)
            .playState(Splash.STATE_NAME, new Splash());
    };

    //Load the font
    WebFont.load(<WebFont.Config>{
        custom: <WebFont.Custom>{
            families: ['Aller Display', 'Lobster'],
            urls: [
                config.baseUrl + 'assets/css/AllerDisplay.css',
                config.baseUrl + 'assets/css/Lobster.css'
            ]
        },
        active: startGame
    });
};
