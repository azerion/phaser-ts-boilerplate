module Fabrique {
    export interface Game extends Phaser.Game {
        events: Fabrique.Plugins.IPortalEvents;
        analytics: {
            google: Fabrique.Plugins.GoogleAnalytics,
            game: Fabrique.Plugins.GameAnalytics,
        };
        add: Fabrique.Plugins.ResponsiveObjectFactory
            & Fabrique.Plugins.SpineObjectFactory;

        make: Fabrique.Plugins.ResponsiveObjectCreator;

        load: Fabrique.Plugins.CacheBustedLoader
            & Fabrique.Plugins.SpineLoader;
    }
}