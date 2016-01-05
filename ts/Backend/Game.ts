class Game
{
    public gameover: boolean = false;

    public shortGame: boolean = false;

    public score: number = 0;

    public success: boolean = false;

    public gameDataObject: Math;

    private call: string = 'init';

    constructor(gameDataObject:Math)
    {
        this.gameDataObject = gameDataObject;
    }

    public handleGameMove(command: any)
    {
        return this.generateResponse();
    }

    public generateResponse()
    {
        var response = {
            score: this.score,
            gameover: this.gameover,
            succes: this.success,
            config: null
        };

        return response;
    }
}