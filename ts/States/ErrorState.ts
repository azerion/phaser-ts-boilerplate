/// <reference path="../references.ts" />

class ErrorState extends Quartz.State
{
    public static STATE_NAME: string = 'error';

    private overlay: PIXI.Graphics;
    private errorPopup: ErrorPopup;

    private hiddingNow: boolean = false;
    private previousStateName:string;

    constructor(previousState, errorType: GameErrors)
    {
        super();

        this.previousStateName = previousState;

        //Load overlay
        this.overlay = new PIXI.Graphics()
            .beginFill(0x000000, 1)
            .drawRect(0, 0, Constants.GAME_WIDTH, Constants.GAME_HEIGHT)
            .endFill();
        this.overlay.alpha = 0;
        this.addChild(this.overlay);

        //Fix the menu
        this.errorPopup = new ErrorPopup(errorType);
        this.errorPopup.pivot = new PIXI.Point(250, 150);
        this.errorPopup.setPinned(
            () => Constants.GAME_WIDTH / 2,
            () => -150
        );
        this.addChild(this.errorPopup);

        this.errorPopup.okButton.setClickHandler(() => this.hide(errorType));

        TweenLite.to(this.overlay, 0.3, {alpha: 0.6})
        TweenLite.to(this.errorPopup, 0.8, {y: Constants.GAME_HEIGHT / 2, delay: 0.3, ease: Back.easeOut, onComplete: () => {
            this.errorPopup.pinnedPoint.y = () => Constants.GAME_HEIGHT / 2;
        }});
    }

    /**
     * Hide the state with a nice animation. remove the state once this has been done
     */
    private hide(errorType: GameErrors): void
    {
        if (!this.hiddingNow)
        {
            this.hiddingNow = true;

            TweenLite.to(this.errorPopup, 0.3, {alpha:0});
            TweenLite.to(this.overlay, 0.4, {alpha: 0, onComplete: () => {
                if (errorType === GameErrors.MAINTENANCE || errorType === GameErrors.MAINTENANCE_STARTED) {
                    Quartz.StateManager.getInstance()
                        .removeState(ErrorState.STATE_NAME)
                        .playState(this.previousStateName);
                } else {
                    triggerRedirect();
                }
            }});
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
