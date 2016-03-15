/// <reference path="../references.ts" />

class Images {
    //Gembly menu assets
    public static BtnBlue: string = 'btn_blue';
    public static BtnBluePress: string = 'btn_blue_onpress';
    public static BtnOrange: string = 'btn_orange';
    public static BtnOrangePress: string = 'btn_orange_onpress';

    //Generic assets
    public static Logo: string = 'OG_logo_fullcolor';
    public static Background: string = 'background_replace';
    public static Button: string = 'button_replace';

    /**
     * A list of all images we want preloaded before the preloader
     * So this is a list of assets we need to show the preloader itself.
     * These should be loaded in the splash screen
     */
    public static preloadList: string[] = [
        Images.BtnBlue,
        Images.BtnBluePress,
        Images.BtnOrange,
        Images.BtnOrangePress,
        Images.Button,
        Images.Logo,
        Images.Background
    ];
}
