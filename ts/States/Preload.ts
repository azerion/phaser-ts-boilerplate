module BoilerPlate {
    export class Preload extends Fabrique.State {
        public static Name: string = 'preload';

        public name: string = Preload.Name;

        constructor() {
            super();
        }

        public preload(): void {
            //preloading goes here!
            let textureResolution: string = '1';

            //Choose 750 because than iPad will still get bigger assets
            if (!this.game.device.desktop && window.innerWidth < 750) {
                textureResolution = '0.5';
            }

            Images.preloadList.forEach((assetName: string) => {
                // this.game.load.image(assetName, 'assets/images/' + assetName + '@' + textureResolution + 'x.png');
                this.game.load.image(assetName, 'assets/images/' + assetName + '.png');
            });

            Atlases.preloadList.forEach((assetName: string) => {
                // this.game.load.atlas(
                //     assetName,
                //     'assets/atlas/' + assetName + '@' + textureResolution + 'x.png',
                //     'assets/atlas/' + assetName + '@' + textureResolution + 'x.json'
                // );
                this.game.load.atlas(
                    assetName,
                    'assets/atlas/' + assetName + '.png',
                    'assets/atlas/' + assetName + '.json'
                );
            });

            Sounds.preloadList.forEach((assetName: string) => {
                if (this.game.device.iOS) {
                    this.game.load.audio(assetName, ['assets/sound/' + assetName + '.m4a']);
                }
                this.game.load.audio(assetName, ['assets/sound/' + assetName + '.ogg', 'assets/sound/' + assetName + '.mp3']);
            });
        }

        public create(): void {
            this.game.state.start(Menu.Name);
        }
    }
}
