module Fabrique {
    /**
     * We overwrite the default Phaser.Game to expose the events to the game object, this is purely for typescript
     */
    export interface IEventedGame extends Phaser.Game {
        events: Fabrique.Plugins.IPortalEvents;
    }

    /**
     * Plugins used by OG-Fabrique
     */
    export module Plugins {
        /**
         * These are all the events we would like to be fired in games (when needed)
         *
         * Ideally a portal can hook up to these events by using adds, or registering a highscore
         */
        export interface IPortalEvents {
            onGameStart: Phaser.Signal;
            onGameEnd: Phaser.Signal;
            onLevelStart: Phaser.Signal;
            onLevelEnd: Phaser.Signal;
            onPause: Phaser.Signal;
            onResume: Phaser.Signal;
        }

        /**
         * GameEvents plugin, adds the events from the PortalEvents interface to the game
         *
         * These are all Phaser.Signals
         */
        export class GameEvents extends Phaser.Plugin {
            constructor(game: Fabrique.IEventedGame, parent: PIXI.DisplayObject) {
                super(game, parent);

                if (!game.hasOwnProperty('events')) {
                    game.events = <Fabrique.Plugins.IPortalEvents>{
                        onGameStart: new Phaser.Signal(),
                        onGameEnd: new Phaser.Signal(),
                        onLevelStart: new Phaser.Signal(),
                        onLevelEnd: new Phaser.Signal(),
                        onPause: new Phaser.Signal(),
                        onResume: new Phaser.Signal()
                    };
                } else {
                    console.warn('Events property already exists on game');
                }
            }
        }
    }
}
