/**
 * Add any other Azerion plugins here after loading them in app.ts
 * e.g. phaser-nineslice
 */
export default interface IGame extends Phaser.Game {
    events: Fabrique.Plugins.IPortalEvents;
    analytics: {
        google: Fabrique.Plugins.GoogleAnalytics,
        game: Fabrique.Plugins.GameAnalytics
    };
    add: PhaserSpine.SpineObjectFactory;
    ads: PhaserAds.AdManager;

    load: PhaserCachebuster.ICacheBustedLoader
        & PhaserSpine.SpineLoader;

    storage: PhaserSuperStorage.StoragePlugin;
}
