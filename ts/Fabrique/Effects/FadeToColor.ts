module Fabrique {
    export module Effects {
        export class FadeToColor extends Phaser.Graphics {
            constructor(game: Phaser.Game, color: number, nextState: string, extraData?: any) {
                super(game);
                this.alpha = 0;
                this.beginFill(color, 1);
                this.drawRect(0, 0, this.game.width, this.game.height);

                game.add.existing(this);
                let t: Phaser.Tween = this.game.add.tween(this);
                t.to({alpha: 1}, 100);
                t.onComplete.add(() => {
                    game.state.start(nextState, true, false, extraData);
                });
                t.start();
            }
        }
    }
}
