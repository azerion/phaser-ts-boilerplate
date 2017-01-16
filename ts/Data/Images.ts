/// <reference path="../references.ts" />

class Images {
    public static BgPreloader: string = 'bg_preloader';
    public static BgMenu: string = 'bg_menu';

    /**
     * A list of all images we need to show the preloader itself.
     * These should be loaded in the splash screen.
     */
    public static preloadList: string[] = [
        Images.BgPreloader
    ];

    /**
     * A list of all images we need after the preloader.
     */
    public static list: string[] = [
        Images.BgMenu
    ];
}
