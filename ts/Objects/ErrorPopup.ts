class ErrorPopup extends Quartz.PinnedContainer {
    public okButton:Quartz.Button;
    //private backOverlay:PIXI.Graphics;
    private back:PIXI.Sprite;
    private ph:PIXI.Sprite;

    constructor(errorType: GameErrors){
        super();
        //this.backOverlay = new PIXI.Graphics();
        //this.backOverlay.beginFill(0x000000,0.4);
        //this.backOverlay.drawRect(-Constants.GAME_WIDTH/2,-Constants.GAME_HEIGHT/2, Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
        //this.addChild(this.backOverlay);

        this.ph = new PIXI.Sprite();
        this.addChild(this.ph);

        var menuContainer = new PIXI.Graphics()
            .beginFill(0x000000, 1)
            .drawRoundedRect(0, 0, 500, 300, 25)
            .endFill()
        menuContainer.alpha = 0.6;
        this.ph.addChild(menuContainer);

        //Load menu header
        var menuHeader = new PIXI.Graphics()
            .beginFill(0x18b0f1, 1)
            .drawRoundedRect(0, 0, 500, 50, 24)
            .drawRect(0, 28, 500, 22)
            .endFill();
        this.ph.addChild(menuHeader);

        var headerText = ogTranslationService.trans('Oh no! Something went wrong!', {}, 'game-errors');
        if (errorType === GameErrors.MAINTENANCE || errorType === GameErrors.MAINTENANCE_STARTED) {
            headerText = ogTranslationService.trans('We are in maintenance', {}, 'game-errors');
        }

        var headerField = new PIXI.Text(headerText, <PIXI.TextStyle>{
            font: '25px "Aller Display"',
            fill:'white',
            stroke: 'black',
            align:'center',
            wordWrap: true,
            wordWrapWidth: 450,
            strokeThickness: 2
        });
        headerField.anchor = new PIXI.Point(0.5, 0.5);
        headerField.x = 250;
        headerField.y = 25;
        this.ph.addChild(headerField);

        var titleField = new PIXI.Text(ogTranslationService.trans('title-' + GameErrors[errorType], {}, 'game-errors'),<PIXI.TextStyle>{
            font: '21px "Aller Display"',
            fill:'white',
            stroke: 'black',
            align:'center',
            wordWrap: true,
            wordWrapWidth: 450,
            strokeThickness: 2
        });
        titleField.anchor = new PIXI.Point(0.5, 0.5);
        titleField.x = 250;
        titleField.y = 85;
        this.ph.addChild(titleField);

        var messageField:PIXI.Text = new PIXI.Text(ogTranslationService.trans('text-' + GameErrors[errorType], {}, 'game-errors'),<PIXI.TextStyle>{
            font: '17px "Montserrat"',
            fill:'white',
            stroke: 'black',
            //align:'center',
            wordWrap: true,
            wordWrapWidth: 450,
            strokeThickness: 2
        });
        messageField.anchor = new PIXI.Point(0.5,0.5);
        messageField.x = 250;
        messageField.y = 170;
        this.ph.addChild(messageField);

        this.okButton = new Quartz.Button(Images.BtnBlue, "Okay", <PIXI.TextStyle>{
            font: '40px "Aller Display"',
            fill:'white',
            stroke: 'black',
            strokeThickness: 2
        }, Images.BtnBluePress);
        this.okButton.scale = new PIXI.Point(0.6,0.6);
        this.okButton.x = 250;
        this.okButton.y = 265;
        this.ph.addChild( this.okButton);
    }
}