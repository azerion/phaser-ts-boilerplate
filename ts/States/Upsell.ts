/// <reference path="../references.ts" />

class Upsell extends Quartz.State
{
    public static STATE_NAME: string = 'upsell';

    private overlay = new PIXI.Graphics();
    private timerField: PIXI.Text;
    private redirectTime:number = 15;

    /**
     * Creates an overlay and adds a nice ribbon telling you you did well.
     * On the finish there is a nice buttons that redirects you
     */
    constructor()
    {
        super();

        //Load overlay
        this.overlay.clear()
            .beginFill(0x000000, 1)
            .drawRect(0, 0, Constants.GAME_WIDTH, Constants.GAME_HEIGHT)
            .endFill();
        this.overlay.alpha = 0;
        this.addChild(this.overlay);

        //add the Ribbon container
        var ribbon = new Quartz.PinnedContainer();
        ribbon.setPinned(
            () => Constants.GAME_WIDTH / 2,
            () => Constants.GAME_WIDTH / 3
        );
        ribbon.pivot = new PIXI.Point(Constants.GAME_WIDTH * 1.5 / 2, 80);
        ribbon.rotation = -0.20;
        this.addChild(ribbon);

        //Add the ribbon itself to the ribbon container
        var ribbonFill = new PIXI.Sprite(this.getLinearGradientTexture());
        ribbonFill.cacheAsBitmap = true;
        ribbonFill.scale = new PIXI.Point(0, 1);
        ribbon.addChild(ribbonFill);

        var upsell = new Quartz.GemblyUpsell();
        upsell.setPinned(
            () => Constants.GAME_WIDTH - 60,
            () => Constants.GAME_HEIGHT - 30
        );
        this.addChild(upsell);

        //Tween the overlay and the ribbon
        TweenLite.to(this.overlay, 0.3, {alpha: 0.7, onComplete: () => this.showContinueButton()});
        TweenLite.to(ribbonFill, 0.3, {scaleX: 1, delay: 0.3, onComplete: () => this.addTextInRibbon(ribbon)});

        //GameAnalytics.getInstance().sendEvent(new DesignEvent('Game:End:Upsell'));
    }

    /**
     * Adds some text to show to the user
     *
     * @param ribbon    The container that should contain the text
     */
    private addTextInRibbon(ribbon: PIXI.Container): void
    {
        var good = new PIXI.Text(Quartz.i18n.getInstance().translate("WellDone"), <PIXI.TextStyle>{
            font: "bold 50px Lobster",
            fill: '#F0E8E1',
            align: 'center',
            dropShadow: true,
            dropShadowColor: '#00266a',
            dropShadowDistance: 3
        });
        good.x = Constants.GAME_WIDTH * 1.5 / 2;
        good.anchor = new PIXI.Point(0.5, 0);
        ribbon.addChild(good);

        var register = new PIXI.Text(Quartz.i18n.getInstance().translate("RegisterNow"), <PIXI.TextStyle>{
            font: "bold 36px Lobster",
            fill: '#F0E8E1',
            align: 'center',
            dropShadow: true,
            dropShadowColor: '#00266a',
            dropShadowDistance: 3
        });
        register.x = Constants.GAME_WIDTH * 1.5 / 2;
        register.y = 80;
        register.anchor = new PIXI.Point(0.5, 0);
        ribbon.addChild(register);

        this.timerField = new PIXI.Text(Quartz.i18n.getInstance().translate("ReturningToGembly")+this.redirectTime+Quartz.i18n.getInstance().translate("Seconds"), {
            font: "25px 'Luckiest Guy'",
            align: 'center',
            fill:'#eef6c5',
            dropShadow: true,
            dropShadowColor: "black",
            dropShadowDistance: 2
        });
        this.timerField.anchor = new PIXI.Point(0.5,0.5);
        this.timerField.x = Constants.GAME_WIDTH / 2;
        if(config.mobile && Constants.GAME_HEIGHT > Constants.GAME_WIDTH) {
            this.timerField.y = Constants.GAME_HEIGHT - 70;
        }else{
            this.timerField.y = Constants.GAME_HEIGHT - 30;
        }
        this.redirectTime = 15;
        TweenLite.delayedCall(1,() => this.countDown());
        this.addChild(this.timerField);
    }

    /**
     * Add the continue button
     */
    private showContinueButton(): void
    {
        var button = new Quartz.Button(Images.Button, 'Continue', {
            font: '28px Lobster',
            fill:'white', stroke: 'black',
            strokeThickness: 2
        });
        button.text.y -= 3;
        button.setPinned(
            () => Constants.GAME_WIDTH / 2,
            () => Constants.GAME_HEIGHT / 2 + 165
        );
        this.addChild(button);

        //Either you click, or we redirect within 15 seconds
        button.setClickHandler(() => triggerRedirect());
        setTimeout(()=> triggerRedirect(), 15000);
    }

    /**
     * Creates an offscreen canvas to render the gradient, because PIXI doesn't do it itself
     * Still fast as hell tho
     *
     * @returns {Texture}
     */
    private getLinearGradientTexture():PIXI.Texture
    {
        //Create the canvas and get the context
        var canvas:HTMLCanvasElement = document.createElement('canvas');
        canvas.width = Constants.GAME_WIDTH * 1.5;
        canvas.height = 160;
        var ctx:CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');

        //Set up the gradient
        var gradient:CanvasGradient = ctx.createLinearGradient(0, 0, 0, 150);
        gradient.addColorStop(0, "#0066FF");
        gradient.addColorStop(1, "#0042B6");

        //Create the gradient fill
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, Constants.GAME_WIDTH * 1.5, 150); //The big gradient square
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 150, Constants.GAME_WIDTH * 1.5, 10); //The nice shadow below it

        //Return the newly create Texture, ready for usage!
        return PIXI.Texture.fromCanvas(canvas);
    }

    private countDown():void{
        this.redirectTime--;
        this.timerField.text = Quartz.i18n.getInstance().translate("ReturningToGembly")+' '+this.redirectTime+' '+Quartz.i18n.getInstance().translate("Seconds");
        if(this.redirectTime == 0){
            triggerRedirect();
        }else{
            TweenLite.delayedCall(1,() => this.countDown());
        }
    }

    /**
     * Called when the canvas resizes
     *
     * @param width     The new width of the canvas
     * @param height    The new height of the canvas
     */
    public onResize(width: number, height: number)
    {
        super.onResize(width, height);

        this.overlay.clear()
            .beginFill(0x000000, 1)
            .drawRect(0, 0, width, height)
            .endFill();
    }
}
