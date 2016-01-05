/// <reference path="../references.ts" />

class Images
{
    //Gembly menu assets
    public static BtnBlue = 'btn_blue';
    public static BtnBluePress = 'btn_blue_onpress';
    public static BtnOrange = 'btn_orange';
    public static BtnOrangePress = 'btn_orange_onpress';

    //Generic assets
    public static Logo: string = 'OG_logo_fullcolor';
    public static Background: string = 'background_replace';
    public static Button: string = 'button_replace';

    /**
     * A list of all images we want preloaded
     */
    public static list:Array<string> = [
        Images.BtnBlue,
        Images.BtnBluePress,
        Images.BtnOrange,
        Images.BtnOrangePress,
        Images.Button
    ];

    /**
     * A list of all images we want preloaded before the preloader
     * So this is a list of assets we need to show the preloader itself.
     * These should be loaded in the splash screen
     */
    public static preloadList:Array<string> = [
        Images.Logo,
        Images.Background
    ];
}
