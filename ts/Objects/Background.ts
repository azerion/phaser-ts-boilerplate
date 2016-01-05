/// <reference path="../references.ts" />

class Background extends Quartz.PinnedContainer
{
    private bg: PIXI.Sprite;
    private imageSize:number;

    constructor()
    {
        super();

        this.bg = PIXI.Sprite.fromImage(Images.Background);
        this.bg.anchor.set(0.5, 0.5);
        this.addChild(this.bg);

        this.imageSize = this.bg.getBounds().width;

        var scale = Math.max(Constants.GAME_HEIGHT, Constants.GAME_WIDTH) / this.imageSize;
        this.bg.scale.set(scale, scale);
    }

    public onResize(width, height)
    {
        var scale = Math.max(width, height) / this.imageSize;
        this.bg.scale.set(scale, scale);
    }
}