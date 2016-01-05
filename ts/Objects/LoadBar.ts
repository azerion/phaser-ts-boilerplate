/// <reference path="../references.ts" />

class LoadBar extends Quartz.PinnedContainer
{
    private loadPrcnt: number = 0;

    private barFill: PIXI.Graphics;

    constructor()
    {
        super();

        this.barFill = new PIXI.Graphics();
        this.barFill.beginFill(0xffd401)
            .drawRect(0, 0, 150, 30);
        this.barFill.scale.set(0, 1);
        this.barFill.x -= 75;
        this.addChild(this.barFill);
    }

    public updatePercentage(loadPrcnt: number)
    {
        this.loadPrcnt = loadPrcnt;
        this.barFill.scale.set(loadPrcnt, 1);
    }
}