/// <reference path="../references.ts" />

class Preload extends Quartz.State
{
    public static STATE_NAME:string = 'preload';

    /**
     * Create the assets we want to show during loading, and sets up the PIXI loader to load the assets
     */
    constructor()
    {
        super();

        var background = new Background();
        background.setPinned(
            () => Constants.GAME_WIDTH / 2,
            () => Constants.GAME_HEIGHT / 2
        );
        this.addChild(background);

        var container = new Quartz.PinnedContainer();
        container.setPinned(
            () => Constants.GAME_WIDTH / 2,
            () => Constants.GAME_HEIGHT / 2
        );
        this.addChild(container);

        var logo = PIXI.Sprite.fromImage(Images.Logo);
        logo.anchor.set(0.5, 0.5);
        logo.y -= 100;
        container.addChild(logo);

        //create the loading bar
        var loadBar = new LoadBar();
        loadBar.setPinned(
            () => Constants.GAME_WIDTH / 2,
            () => Constants.GAME_HEIGHT / 4  * 3
        );
        this.addChild(loadBar);

        //Create the asset loader
        var loader = new Quartz.AssetLoader(Images.list, Sounds.list, null, config.baseUrl);
        loader.onProgress = (evt:any) => this.loadProgress(evt, loadBar);
        loader.onComplete = (evt:any) => this.loadComplete(evt, loadBar);
        loader.load();
    }

    /**
     * Progress handler for the loader. redraw's the loading bar.
     *
     * @param evt           The progress load event
     * @param loadBarFill   The loadbar filling we want to update
     */
    private loadProgress(evt: any, loadBar: LoadBar): void
    {
        var prct = Math.round ((evt.loaded / evt.total) * 100) / 100;
        loadBar.updatePercentage(prct);
    }

    /**
     * Complete handler for the loader, animates the screen objects away and progresses to the Main State
     *
     * @param evt           The load complete event
     * @param loadBar       The loadbar to animate away
     * @param loadBarFill   The fill to animate away
     * @param logo          The lgoo to animate away
     */
    private loadComplete(evt: any, loadBar: LoadBar): void
    {
        loadBar.updatePercentage(1);

        TweenLite.to(loadBar, 0.5, {alpha: 0});
        TweenLite.to(loadBar, 0.5, {alpha: 0, onComplete: () => {
            Quartz.StateManager.getInstance()
                .playState(Main.STATE_NAME, new Main())
                .removeState(Preload.STATE_NAME);
        }});
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
    }

}