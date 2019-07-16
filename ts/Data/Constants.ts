/**
 * All the global variables which will be used throughout the game.
 */
export default class Constants {
    //Size and scale
    public static GAME_SCALE: number = 1;
    public static CALCULATED_WIDTH: number = 0;
    public static CALCULATED_HEIGHT: number = 0;
    public static LANDSCAPE_LOCKED: boolean = false;
    public static PORTRAIT_LOCKED: boolean = false;

    //Game name
    public static GAME_NAME: string             = 'og-fabrique-boilerplate';

    //Storage key
    public static STORAGE_KEY: string          = 'bp_sg';

    public static AVAILABLE_LANGUAGES: string[] = ['en', 'nl', 'es', 'fr', 'it'];
}
