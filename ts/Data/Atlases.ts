export default class Atlases {
    public static Interface: string = 'interface';

    /**
     *  A list of all atlases we need for the preloader.
     */
    public static preloadList: string[] = [
        //Add atlases
    ];

    /**
     * A list of all atlases we need after the preloader.
     */
    public static list: string[] = [
        Atlases.Interface
    ];
}
