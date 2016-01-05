class Play extends Quartz.State
{
    public static NAME: string = 'play';

    private background: Background = new Background();

    constructor(data: Quartz.Response)
    {
        super();

        console.log(data);

        this.addChild(this.background);

        Quartz.Socket.getInstance().on('data', (data: any) => this.dataHandler(data));
        Quartz.Socket.getInstance().send(new Quartz.Request('start', Quartz.Session.getInstance()));
    }

    public dataHandler(data: Quartz.Response)
    {
        console.log(data);

        if (data.get('gameover') === true) {
            //play gameover state
        }
    }
}