module Fabrique {
    export interface IGame extends Phaser.Game {
        events: Fabrique.Plugins.IPortalEvents;
        analytics: {
            google: Fabrique.Plugins.GoogleAnalytics,
            game: Fabrique.Plugins.GameAnalytics,
        };
        add: Fabrique.Plugins.SpineObjectFactory;

        load: Fabrique.Plugins.CacheBustedLoader
            & Fabrique.Plugins.SpineLoader;
    }
}
