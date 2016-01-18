module Fabrique {
    /**
     * We overwrite the default Phaser.Game to expose the events to the game object, this is purely for typescript
     */
    interface GameAnalyticsGame extends Phaser.Game {
        analytics: {
            game: Fabrique.Plugins.GameAnalytics
        };
    }

    export module Plugins {
        export class GameAnalytics extends Phaser.Plugin {

            private ga:GA.GameAnalytics;

            constructor(game:GameAnalyticsGame, parent:PIXI.DisplayObject) {
                super(game, parent);

                this.ga = GA.getInstance();

                if (!game.hasOwnProperty('analytics')) {
                    game.analytics = {
                        game: this
                    };
                } else {
                    Object.defineProperty(game.analytics, 'game', {
                        value: this
                    });
                }
            }

            public setup(key:string, secret:string, buildId:string, user:GA.User, trackErrors:boolean = true) {
                this.ga.init(key, secret, buildId, user)
                    .addEvent(new GA.Events.User());

                if (trackErrors) {
                    this.setupErrorTracking();
                }
            }

            public createUser(userId?:string, facebookId?:string, gender?:GA.Gender, birthYear?:number):GA.User {
                if (undefined === userId || null === userId) {
                    userId = (Date.now() + Math.random() * 100 | 0).toString();
                }

                return new GA.User(userId, facebookId, gender, birthYear);
            }

            public addEvent(event:GA.Events.Event) {
                this.ga.addEvent(event);
            }

            public sendEvents() {
                this.ga.sendData();
            }

            private setupErrorTracking() {
                var triggeredErrors:string[] = [];

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
                        message += "\ncolumn:" + event.colno;
                    }
                    if (event.error) {
                        message += '\nDetails' + event.error;
                    }

                    this.ga.addEvent(new GA.Events.Exception(GA.Events.ErrorSeverity.critical, message))
                        .sendData();
                });

                window.addEventListener('error', (event:ErrorEvent) => {
                    var stack = event.message;

                    if (event.hasOwnProperty('error') && event.error.hasOwnProperty('stack')) {
                        stack = event.error.stack;
                    }

                    this.ga.addEvent(new GA.Events.Exception(GA.Events.ErrorSeverity.critical, stack))
                        .sendData();
                });
            }
        }
    }
}