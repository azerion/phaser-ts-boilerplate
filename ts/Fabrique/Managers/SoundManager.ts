module BoilerPlate {
    export class SoundManager {
        private static instance: SoundManager = null;

        private sound: Phaser.SoundManager;

        private music: Phaser.Sound = null;

        private audioInstances: {
            [name: string]: Phaser.Sound
        } = {};

        private constructor(game: Phaser.Game) {
            this.sound = game.sound;
        }

        public static getInstance(game?: Phaser.Game): SoundManager {
            if (null === SoundManager.instance) {
                if (!game) {
                    throw new Error('Cant create a new instance without a game');
                }

                SoundManager.instance = new SoundManager(game);
            }

            return SoundManager.instance;
        }

        public play(key: string, volume: number = 1, loop: boolean = false): Phaser.Sound {
            if (!Save.Game.getInstance().sfx) {
                return null;
            }

            if (!this.audioInstances.hasOwnProperty(key)) {
                this.audioInstances[key] = this.sound.add(key);
            }

            this.audioInstances[key].play(undefined, undefined, volume, loop, true);
            return this.audioInstances[key];
        }

        public stop(key: string): void {
            if (this.audioInstances.hasOwnProperty(key)) {
                this.audioInstances[key].stop();
            }
        }

        public playMusic(key: string): void {
            if (!Save.Game.getInstance().music) {
                return;
            }

            if (null === this.music || this.music.name !== key) {
                if (null !== this.music && this.music.name !== key) {
                    this.music.stop();
                }

                this.music = this.sound.play(key, 1, true);
            }
        }

        public fadeMusicVolume(duration: number, volume: number): void {
            if (this.music) {
                this.music.fadeTo(duration, volume);
            }
        }

        public stopMusic(): void {
            if (null === this.music) {
                return;
            }

            if (this.music.isPlaying) {
                this.music.stop();
            }
        }

        public toggleSfx(): void {
            Save.Game.getInstance().sfx = !Save.Game.getInstance().sfx;
        }

        public toggleMusic(): void {
            Save.Game.getInstance().music = !Save.Game.getInstance().music;

            if (!Save.Game.getInstance().music) {
                if (this.music && this.music.isPlaying) {
                    this.stopMusic();
                }
            } else {
                if (this.music) {
                    this.music.play(undefined, undefined, 1, true);
                }
            }
        }
    }
}
