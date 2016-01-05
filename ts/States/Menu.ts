/// <reference path="../references.ts" />

class Menu extends Quartz.State
{
    public static STATE_NAME: string = 'menu';

    private overlay: PIXI.Graphics;

    private menu: Quartz.PinnedContainer = new Quartz.PinnedContainer();

    private hiddingNow: boolean = false;

    private previousStateName:string;

    private confirmPopup:ConfirmPopup;

    constructor(previousState)
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
        this.menu.pivot = new PIXI.Point(150, 150);
        this.menu.setPinned(
            () => Constants.GAME_WIDTH / 2,
            () => -150
        );
        this.addChild(this.menu);

        //Load overlay
        var menuContainer = new PIXI.Graphics()
            .beginFill(0x000000, 1)
            .drawRoundedRect(0, 0, 300, 300, 25)
            .endFill()
        menuContainer.alpha = 0.6;
        this.menu.addChild(menuContainer);


        //Load menu header
        var menuHeader = new PIXI.Graphics()
            .beginFill(0x18b0f1, 1)
            .drawRoundedRect(0, 0, 300, 50, 24)
            .drawRect(0, 28, 300, 22)
            .endFill();
        this.menu.addChild(menuHeader);

        var quitButton = new Quartz.Button(Images.BtnBlue, 'Quit', <PIXI.TextStyle>{
            font: '28px "Aller Display"',
            fill:'white',
            stroke: 'black',
            strokeThickness: 2
        }, Images.BtnBluePress);
        quitButton.x = 150;
        quitButton.y = 250;
        quitButton.setClickHandler((target: PIXI.Point) => this.onQuit());
        this.menu.addChild(quitButton);

        var muteButton = new Quartz.Button(
            Images.BtnOrange,
            (!Quartz.Sound.mute) ? 'Sound: Off' : 'Sound: On',
            <PIXI.TextStyle>{
                font: '28px "Aller Display"',
                fill:'white',
                stroke: 'black',
                strokeThickness: 2
            },
            Images.BtnOrangePress
        );
        muteButton.x = 150;
        muteButton.y = 150;
        muteButton.setClickHandler((target: PIXI.Point) => this.toggleSound(muteButton));
        this.menu.addChild(muteButton);

        //Add logo
        var logo = PIXI.Sprite.fromImage(Images.Logo);
        logo.scale = new PIXI.Point(0, 0);
        logo.anchor = new PIXI.Point(0.5, 0.5);
        logo.x = 150;
        logo.y = 25;
        this.menu.addChild(logo);

        var upsell = new Quartz.GemblyUpsell();
        upsell.setPinned(
            () => Constants.GAME_WIDTH - 60,
            () => Constants.GAME_HEIGHT - 30
        );
        this.addChild(upsell);

        var close = new Quartz.TextButton('X', <PIXI.TextStyle>{
            font: '36px "Aller Display"',
            fill:'white', stroke: 'black',
            strokeThickness: 2
        });
        close.x = 265;
        close.y = 20;
        close.setClickHandler(() => this.hide());
        this.menu.addChild(close);

        TweenLite.to(this.overlay, 0.3, {alpha: 0.6})
        TweenLite.to(this.menu, 0.8, {y: Constants.GAME_HEIGHT / 2, delay: 0.3, ease: Back.easeOut, onComplete: () => {
            this.menu.pinnedPoint.y = () => Constants.GAME_HEIGHT / 2;
        }});
        TweenLite.to(logo, 0.8, {scaleX: 0.4, scaleY: 0.4, delay: 1.1, ease: Back.easeOut});
    }

    /**
     * Fired when the quit button has been hit. Quits the game
     */
    public onQuit(): void
    {
        //updateInstance.quit();
        this.showConfirmDialog();
        //this.hide();
    }

    public onPointerClick(evt: PIXI.Point): void
    {
        super.onPointerClick(evt);

        if (
            (evt.x > Constants.GAME_WIDTH / 2 - 150 && evt.x < Constants.GAME_WIDTH / 2 + 150) &&
            (evt.y > Constants.GAME_HEIGHT / 2 - 150 && evt.y < Constants.GAME_HEIGHT / 2 + 150)
        ) {
            return;
        }

        this.hide();
    }

    public showConfirmDialog():void{
        if(this.confirmPopup == null) {
            this.confirmPopup = new ConfirmPopup("QuitText", "Yes", "No");
        }
        this.addChild(this.confirmPopup);
        this.confirmPopup.setPinned(() => Constants.GAME_WIDTH/2-150, () => Constants.GAME_HEIGHT/2-150);
        this.confirmPopup.yesButton.setClickHandler(() => this.quitGame());
        this.confirmPopup.noButton.setClickHandler(() => this.hide());
        this.menu.visible = false;
    }

    public quitGame():void{
        this.hide();
        if(Quartz.Socket.getInstance().isConnected){
            Quartz.Socket.getInstance().send(new Quartz.Request('quit', Quartz.Session.getInstance(),{}));
        }else{
            triggerRedirect();
        }
    }

    /**
     * Action for sound button, toggles sound between Muted / UnMuted
     * @param button
     */
    public toggleSound(button: Quartz.Button): void
    {
        if (!Quartz.Sound.mute) {
            button.changeText('Sound: On');
        } else {
            button.changeText('Sound: Off');
        }

        Quartz.Sound.mute = !Quartz.Sound.mute;
    }

    /**
     * Hide the state with a nice animation. remove the state once this has been done
     */
    private hide(): void
    {
        if (!this.hiddingNow)
        {
            this.removeChild(this.confirmPopup);
            TweenLite.to(this.overlay, 0.4, {alpha: 0, onComplete: () => {
                Quartz.StateManager.getInstance()
                    .removeState(Menu.STATE_NAME)
                    .playState(this.previousStateName);
            }})
            TweenLite.to(this.menu, 0.3, {alpha:0});
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
