module Fabrique {
    export interface ISplashConfic {
        bgColor: number;
        image: string;
        clickUrl: string;
        nextState: string;
    }

    export class Splash extends Fabrique.State {
        public static Name:string = 'splashScreen';

        private bgImage:string;

        private clickUrl:string;

        private nextState:string;

        private bgColor:number;

        constructor() {
            super();
        }

        public init(config: ISplashConfic) {
            this.bgImage = config.image;

            this.clickUrl = config.clickUrl;

            this.nextState = config.nextState;

            this.bgColor = config.bgColor;
        }

        public preload():void {
            this.game.load.image(this.bgImage, 'assets/images/' + this.bgImage + '.png');

            Images.preloadList.forEach((assetName: string) => {
                this.game.load.image(assetName, 'assets/images/' + assetName + '.png');
            });

            Sounds.preloadList.forEach((assetName:string) => {
                this.game.load.audio(assetName, [
                    'assets/sound/' + assetName + '.ogg',
                    'assets/sound/' + assetName + '.mp3'
                ]);
            });

            Atlases.preloadList.forEach((assetName: string) => {
                this.game.load.atlas(assetName, 'assets/atlas/' + assetName + '.png','assets/atlas/' + assetName + '.json');
            });
        }

        public create():void {
            this.game.analytics.google.sendScreenView('Splash');
            this.game.add.graphics(0, 0)
                .beginFill(this.bgColor)
                .drawRect(0, 0, this.game.width, this.game.height);

            //Add the logo
            var logo:Phaser.Image = this.game.add.image(Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2, this.bgImage);
            var scale = (Constants.GAME_WIDTH * 0.7) / logo.width;
            logo.scale.set(0, 0);
            logo.anchor.set(0.5, 0.5);
            logo.inputEnabled = true;
            logo.events.onInputDown.add(() => {
                window.open(Utils.getUtmCampaignLink(UtmTargets.splash), "_blank");
            });

            //Tween the logo
            var logoIn:Phaser.Tween = this.game.add.tween(logo.scale);
            logoIn.to({x: scale, y: scale}, 1000, Phaser.Easing.Back.Out);
            logoIn.to({x: 0, y: 0}, 1000, Phaser.Easing.Back.In);
            logoIn.onComplete.addOnce(() => {
                //Logo done tweening, start next state
                this.game.state.start(this.nextState);
            });
            logoIn.start();
        }
    }
}