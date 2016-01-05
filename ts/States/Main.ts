/// <reference path="../references.ts" />

class Main extends Quartz.State
{
    public static STATE_NAME: string = 'main';
    /**
     * Local copy of the serverdata handler so we can remove it later on
     */
    private dataHandler: (data: Quartz.Response) => void;

    private background: Background;

    private logo:PIXI.Sprite;

    private tutorialClicked: boolean = false;

    private playedTutorial: number = 0;

    /**
     * Create some buttons and connect to the game socket.
     */
    constructor()
    {
        super();

        this.playedTutorial = parseInt(Quartz.Storage.getInstance().get('tutorial') || '0', 10);

        this.background = new Background();
        this.background.setPinned(
            () => Constants.GAME_WIDTH / 2,
            () => Constants.GAME_HEIGHT / 2
        );
        this.addChild(this.background);

        var container = new Quartz.PinnedContainer();
        container.setPinned(
            () => Constants.GAME_WIDTH / 2,
            () => Constants.GAME_HEIGHT / 2
        );
        this.addChild(container);

        //create the loading bar
        this.logo = PIXI.Sprite.fromImage(Images.Logo);
        this.logo.anchor.set(0.5, 0.5);
        this.logo.y -= 100;
        container.addChild(this.logo);

        //Create the start button
        var startButton = new Quartz.Button(Images.Button, 'Play', <PIXI.TextStyle>{
            font: '30px "Aller Display"',
            fill:'white',
            dropShadow: true,
            dropShadowColor: "black",
            dropShadowDistance: 2
        });
        startButton.visible = false;
        startButton.setPinned(
            () => Constants.GAME_WIDTH / 2,
            () => Constants.GAME_HEIGHT / 2 + 73
        );
        this.addChild(startButton);

        //Create the menu button
        var menuButton = new Quartz.Button(Images.Button, 'Menu', <PIXI.TextStyle>{
            font: '30px "Aller Display"',
            fill:'white',
            dropShadow: true,
            dropShadowColor: "black",
            dropShadowDistance: 2
        });
        menuButton.visible = true;
        menuButton.setPinned(
            () => Constants.GAME_WIDTH - 100,
            () => 50
        );
        menuButton.setClickHandler(() => {
            Quartz.Sound.get(Sounds.Click).play();
            Quartz.StateManager.getInstance().playState(Menu.STATE_NAME, new Menu(Main.STATE_NAME));
        });
        this.addChild(menuButton);

        //@if ENV='partner'
        var upsell = new Quartz.GemblyUpsell();
        upsell.setPinned(
            () => Constants.GAME_WIDTH - 60,
            () => Constants.GAME_HEIGHT - 30
        );
        this.addChild(upsell);
        //@endif

        //Create the data handler
        this.dataHandler = this.onData.bind(this);

        //Set up the socket
        var GS = Quartz.Socket.getInstance(
            new Game(Math)
            //@if ENV!='gembly'
            , true
            //@endif
        );
        GS.surpressErrorPopup();
        GS.on('data', this.dataHandler);
        GS.on('connect', () => {
            startButton.visible = true;
        });
        GS.connect();

        GS.on('data', (response:Quartz.Response) => {
            if (response.get('call') === 'error') {
                var activeState = Quartz.StateManager.getInstance().getActiveState();
                Quartz.StateManager.getInstance().playState(ErrorState.STATE_NAME, new ErrorState(activeState, response.get('message')));
            }
        });
        GS.on('error', () => {
            var activeState = Quartz.StateManager.getInstance().getActiveState();
            Quartz.StateManager.getInstance().playState(ErrorState.STATE_NAME, new ErrorState(activeState, GameErrors.SERVER_CONNECTION));
        });

        //Add the click button action
        startButton.setClickHandler((target: PIXI.Point) => this.onPlayClick(target));
    }

    /**
     * Data handler for the init state. Once we receive the init state we start the game
     *
     * @param data
     */
    private onData(data: Quartz.Response): void
    {
        var stateManager: Quartz.StateManager = Quartz.StateManager.getInstance();
        if (data.get('call') === 'init') {
            stateManager.playState(Play.STATE_NAME, new Play(data));
            setTimeout(() => {
                stateManager.removeState(Main.STATE_NAME);
            }, 100);

            Quartz.Socket.getInstance().off('data', this.dataHandler);
        }
    }

    /**
     * Action for the play button, bsicly start a play state so we can play the game
     *
     * @param evt
     */
    private onPlayClick(target: PIXI.Point): void
    {
        Quartz.Socket.getInstance().send(new Quartz.Request('init', Quartz.Session.getInstance()));
    }

    /**
     * Called when the canvas resizes
     *
     * @param width     The new width of the canvas
     * @param height    The new height of the canvas
     */
    public onResize(width: number, height: number): void
    {
        super.onResize(width, height);
    }

    /**
     * Used for updating assets based on gyro rotation
     *
     * @param orientation
     */
    public orientationUpdate(orientation: PIXI.Point): void
    {
        super.orientationUpdate(orientation);
    }
}
