class ConfirmPopup extends Quartz.PinnedContainer {
    public yesButton:Quartz.Button;
    public noButton:Quartz.Button;
    private backOverlay:PIXI.Graphics;
    private back:PIXI.Sprite;

    constructor(message:string = "QuitText", yesText:string="Yes", noText:string = "No"){
        super();
        var menuContainer = new PIXI.Graphics()
            .beginFill(0x000000, 1)
            .drawRoundedRect(0, 0, 300, 300, 25)
            .endFill()
        menuContainer.alpha = 0.6;
        this.addChild(menuContainer);

        //Load menu header
        var menuHeader = new PIXI.Graphics()
            .beginFill(0x18b0f1, 1)
            .drawRoundedRect(0, 0, 300, 50, 24)
            .drawRect(0, 28, 300, 22)
            .endFill();
        this.addChild(menuHeader);

        var logo = PIXI.Sprite.fromImage(Images.Logo);
        logo.scale = new PIXI.Point(0.4, 0.4);
        logo.anchor = new PIXI.Point(0.5, 0.5);
        logo.x = 150;
        logo.y = 25;
        this.addChild(logo);

        var messageField:PIXI.Text = new PIXI.Text(Quartz.i18n.getInstance().translate(message),<PIXI.TextStyle>{
            font: '30px "Aller Display"',
            fill:'white',
            stroke: 'black',
            align:'center',
            wordWrap: true,
            wordWrapWidth: 250,
            strokeThickness: 2
        })
        messageField.anchor = new PIXI.Point(0.5,0.5);
        messageField.x = 150;
        messageField.y = 120;
        this.addChild(messageField);

        this.yesButton = new Quartz.Button(Images.BtnBlue, yesText, <PIXI.TextStyle>{
            font: '40px "Aller Display"',
            fill:'white',
            stroke: 'black',
            strokeThickness: 2
        }, Images.BtnBluePress);
        this.yesButton.scale = new PIXI.Point(0.6,0.6);
        this.yesButton.x = 80;
        this.yesButton.y = 250;
        this.addChild( this.yesButton);

        this.noButton = new Quartz.Button(Images.BtnOrange, noText, <PIXI.TextStyle>{
            font: '40px "Aller Display"',
            fill:'white',
            stroke: 'black',
            strokeThickness: 2
        }, Images.BtnOrangePress);
        this.noButton.scale = new PIXI.Point(0.6,0.6);
        this.noButton.x = 220;
        this.noButton.y = 250;
        this.addChild( this.noButton);

    }
}