/// <reference path="../references.ts" />
/**
 * All the global variables which will be used throughout the game.
 */
class Constants {
    //Size and scale
    public static GAME_SCALE: number = 1;
    public static GAME_ORIGINAL_WIDTH: number = 1280;
    public static GAME_ORIGINAL_HEIGHT: number = 720;
    public static GAME_WIDTH: number = Constants.GAME_ORIGINAL_WIDTH;
    public static GAME_HEIGHT: number = Constants.GAME_ORIGINAL_HEIGHT;
    public static LANDSCAPE_LOCKED: boolean = false;
    public static PORTRAIT_LOCKED: boolean = false;

    //Game Analytics
    public static GAME_KEY: string              = '';
    public static SECRET_KEY: string            = '';
    public static BUILD: string                 = '1.0.0';

    //Google Analytics
    public static GOOGLE_ID: string             = '';
    public static GOOGLE_APP_NAME: string       = '';

    //Splash screen config
    public static SPLASH_BACKGROUND: number     = 0xa9a9a9;
    public static SPLASH_IMAGE: string          = 'OG_logo_fullcolor';
    public static SPLASH_URL: string            = 'http://www.funnygames.nl';

    //More Games link
    public static MORE_GAMES_URL: string        = 'http://www.funnygames.nl';
    public static GAME_TITLE: string            = '';
}
