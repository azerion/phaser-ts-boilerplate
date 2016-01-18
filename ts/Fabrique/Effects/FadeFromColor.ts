module Fabrique {
    export module Effects {
        export class FadeFromColor extends Phaser.Graphics {
            constructor(game:Phaser.Game, color:number, callback:() => void = null) {
                super(game);
                this.beginFill(color, 1);
                this.drawRect(0, 0, Constants.GAME_WIDTH, Constants.GAME_HEIGHT);

                //game.add.existing(this);
                var group:Phaser.Group = game.add.group(this, 'white', true);
                group.add(this);

                var t:Phaser.Tween = this.game.add.tween(this);
                t.to({alpha: 0}, 100);
                t.onComplete.add(() => {
                    if (null !== callback) {
                        callback();
                    }
                });
                t.start();
            }
        }
    }
}