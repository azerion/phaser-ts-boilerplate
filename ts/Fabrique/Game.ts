module Fabrique {
    export interface Game extends Phaser.Game {
        events: Fabrique.Plugins.IPortalEvents;
        analytics: {
            google: Fabrique.Plugins.GoogleAnalytics,
            game: Fabrique.Plugins.GameAnalytics,
        };
        load: Fabrique.Plugins.CacheBustedLoader;
    }
}