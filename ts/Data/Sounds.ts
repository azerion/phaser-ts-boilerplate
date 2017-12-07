export default class Sounds {
    //Background music
    public static MenuMusic: string = 'doobly_doo';
    public static GameMusic: string = 'overworld';

    //Sound effects
    public static Click: string = 'click';

    /**
     * A list of all audio we need for the preloader.
     */
    public static preloadList: string[] = [
       //Add preloader audio
    ];

    /**
     * A list of all audio we need after the preloader.
     */
    public static list: string[] = [
        Sounds.MenuMusic,
        Sounds.GameMusic,
        Sounds.Click
    ];
}
