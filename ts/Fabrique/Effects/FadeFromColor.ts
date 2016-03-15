module Fabrique {
    export module Effects {
        export class FadeFromColor extends Phaser.Graphics {
            constructor(game: Phaser.Game, color: number, callback: () => void = null) {
                super(game);
                this.beginFill(color, 1);
                this.drawRect(0, 0, this.game.width, this.game.height);

                //game.add.existing(this);
                let group: Phaser.Group = game.add.group(this, 'white', true);
                group.add(this);

                let t: Phaser.Tween = this.game.add.tween(this);
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
