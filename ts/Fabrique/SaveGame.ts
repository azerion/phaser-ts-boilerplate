module BoilerPlate {
    export module Save {
        interface IRecoveredState {
            m: boolean;     //Music
            sf: boolean;    //Sound effects
        }

        export class Game {
            private static instance: Game;

            private game: Fabrique.IGame;

            private musicOn: boolean = false;
            private sfxOn: boolean = false;

            //Use this callback if you need to call something after the saved data has been restored.
            private callback: () => void;
            private callbackContext: any;

            constructor(game: Fabrique.IGame, callback?: () => void, callbackContext?: any) {
                this.game = game;
                this.callback = callback;
                this.callbackContext = callbackContext;

                //Check if data was saved before for this game
                this.game.storage.getItem('sg').then((storedItem: any) => {
                    if (storedItem === null || storedItem === undefined) {   //No save data found. Make the first save.
                        //Put music and sound effects on the first time
                        this.sfxOn = true;
                        this.musicOn = true;

                        //Make first save.
                        this.save();

                        if (this.callback && this.callbackContext) {
                            this.callback.call(this.callbackContext);
                        }
                    } else {
                        this.restore();
                    }
                });
            }

            public static getInstance(game?: Fabrique.IGame, callback?: () => void, callbackContext?: any): Game {
                if (!Game.instance) {
                    Game.instance = new Game(game, callback, callbackContext);
                }

                return Game.instance;
            }

            public get music(): boolean {
                return this.musicOn;
            };

            public set music(value: boolean) {
                this.musicOn = value;

                this.save();
            };

            public get sfx(): boolean {
                return this.sfxOn;
            };

            public set sfx(value: boolean) {
                this.sfxOn = value;

                this.save();
            };

            /**
             * Saves the game's data to storage
             */
            private save(): void {
                //Save the data
                let data: string = JSON.stringify(<IRecoveredState>{
                    m: this.musicOn,
                    sf: this.sfxOn
                });
                let hash: string = this.hash(data);

                this.game.storage.setItem('sg', data);
                this.game.storage.setItem('h', hash);
            }

            /**
             * Restores a save game from storage
             */
            private restore(): void {
                //restore the data
                let storedData: any = this.game.storage.getItem('sg');
                let storedHash: any = this.game.storage.getItem('h');

                let data: string;
                let hash: string;

                Promise.all([storedData, storedHash])
                    .then((values: any) => {
                        data = values[0] || '';
                        hash = values[1] || '0';

                        if ('' === data) {
                            return;
                        }

                        if (hash !== this.hash(data)) {
                            console.warn('Incorrect save data.');
                            return;
                        }

                        if (data && data !== '') {
                            try {
                                let save: IRecoveredState = JSON.parse(data);

                                this.musicOn = save.m;
                                this.sfxOn = save.sf;

                            } catch (e) {
                                console.warn('Unable to parse save game.', e);
                            }
                        } else {
                            console.log('No saved data.');
                        }

                        if (this.callback && this.callbackContext) {
                            this.callback.call(this.callbackContext);
                        }
                    });
            }

            /**
             * Hashing function to calculate the hash of any given string, used for anti-cheat
             *
             * @param data
             * @returns {string}
             */
            private hash(data: string): string {
                let hash: number = 0, i: number, chr: number, len: number;

                if (data.length === 0) {
                    return hash.toString();
                }

                for (i = 0, len = data.length; i < len; i++) {
                    chr = data.charCodeAt(i);
                    hash = ((hash << 5) - hash) + chr;
                    hash |= 0; // Convert to 32bit integer
                }

                return hash.toString();
            }
        }
    }
}
