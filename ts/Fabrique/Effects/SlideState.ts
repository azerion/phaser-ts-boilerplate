module Fabrique {
    export module Effects {
        export class SlideState {
            public static SlideTime: number = 250;

            public static EaseIn: Function = Phaser.Easing.Quartic.Out;

            public static EaseOut: Function = Phaser.Easing.Quartic.In;

            private static boundsSet: boolean = false;

            public static fromTop(game: Phaser.Game, cb?: () => void): void {
                if ( !SlideState.boundsSet ) {
                    SlideState.setBounds(game);
                }

                game.world.cacheAsBitmap = true;
                game.add.tween(game.camera).from({y: game.height}, SlideState.SlideTime, SlideState.EaseIn, true).onComplete.add(() => {
                    if ( cb !== undefined ) {
                        cb();
                    }

                    game.world.cacheAsBitmap = false;
                });
            }

            public static toRight(game: Phaser.Game, cb?: () => void): void {
                if ( !SlideState.boundsSet ) {
                    SlideState.setBounds(game);
                }

                game.world.cacheAsBitmap = true;
                game.add.tween(game.camera).to({x: -game.width}, SlideState.SlideTime, SlideState.EaseOut, true).onComplete.add(() => {
                    if ( cb !== undefined ) {
                        cb();
                    }

                    game.world.cacheAsBitmap = false;
                });
            }

            public static fromRight(game: Phaser.Game, cb?: () => void): void {
                if ( !SlideState.boundsSet ) {
                    SlideState.setBounds(game);
                }

                game.world.cacheAsBitmap = true;
                game.add.tween(game.camera).from({x: -game.width}, SlideState.SlideTime, SlideState.EaseIn, true).onComplete.add(() => {
                    if ( cb !== undefined ) {
                        cb();
                    }

                    game.world.cacheAsBitmap = false;
                });
            }

            public static toLeft(game: Phaser.Game, cb?: () => void): void {
                if ( !SlideState.boundsSet ) {
                    SlideState.setBounds(game);
                }

                game.world.cacheAsBitmap = true;
                game.add.tween(game.camera).to({x: game.width}, SlideState.SlideTime, SlideState.EaseOut, true).onComplete.add(() => {
                    if ( cb !== undefined ) {
                        cb();
                    }

                    game.world.cacheAsBitmap = false;
                });
            }

            public static fromLeft(game: Phaser.Game, cb?: () => void): void {
                if ( !SlideState.boundsSet ) {
                    SlideState.setBounds(game);
                }

                game.world.cacheAsBitmap = true;
                game.add.tween(game.camera).from({x: game.width}, SlideState.SlideTime, SlideState.EaseIn, true).onComplete.add(() => {
                    if ( cb !== undefined ) {
                        cb();
                    }

                    game.world.cacheAsBitmap = false;
                });
            }

            private static setBounds(game: Phaser.Game): void {
                game.world.setBounds(-game.width, -game.height, game.width * 3, game.height * 3);

                SlideState.boundsSet = true;
            }
        }
    }
}
