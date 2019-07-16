import 'p2';
import 'pixi';
import 'phaser';

export default class Label extends PhaserI18n.TranslatedText {
    private maxWidth: number;
    private maxHeight: number;

    constructor(game: Phaser.Game, x: number, y: number, text: string, style: Object, maxWidth?: number, maxHeight?: number) {
        super(game, x, y, text, style);

        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;

        this.game.add.existing(this);
    }

    /**
     * Every time it sets the text, it will also check if the label still fits the max size.
     * @param text
     * @returns {Label}
     */
    public setText(text: string): Label {
        super.setText(text);

        if (this.maxWidth || this.maxHeight) {
            this.makeFontFit();
        }

        return this;
    }

    public setMaxSize(maxWidth: number, maxHeight: number): void {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }

    /**
     * Makes the font size smaller until the text fits the max size allowed.
     * Useful when handling different languages or dynamic text (like score, for example).
     */
    private makeFontFit(): void {
        let minFontSize: number = 10;
        let newFontSize: number;

        while (this.width > this.maxWidth || this.height > this.maxHeight) {
            newFontSize = parseInt(this.fontSize.toString().replace('px', ''), 10) - 1;
            if (newFontSize < minFontSize) {
                newFontSize = minFontSize;
                this.fontSize = newFontSize;
                break;
            }
            this.fontSize = newFontSize;
        }
    }
}
