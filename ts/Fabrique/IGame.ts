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
    add: PhaserSpine.SpineObjectFactory & PhaserI18n.LocaleObjectFactory;
    ads: PhaserAds.AdManager;

    i18n: PhaserI18n.Plugin;

    load: PhaserCachebuster.ICacheBustedLoader & PhaserSpine.SpineLoader & PhaserI18n.LocaleLoader;

    storage: PhaserSuperStorage.StoragePlugin;
}
