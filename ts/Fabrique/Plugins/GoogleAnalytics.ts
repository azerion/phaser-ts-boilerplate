module Fabrique {
    /**
     * We overwrite the default Phaser.Game to expose the events to the game object, this is purely for typescript
     */
    interface IGoogleAnalyticsGame extends Phaser.Game {
        analytics: {
            google: Fabrique.Plugins.GoogleAnalytics
        };
    }

    export module Plugins {
        export class GoogleAnalytics extends Phaser.Plugin {
            constructor(game: IGoogleAnalyticsGame, parent: Phaser.PluginManager) {
                super(game, parent);

                if (!game.hasOwnProperty('analytics')) {
                    game.analytics = {
                        google: this
                    };
                } else {
                    Object.defineProperty(game.analytics, 'google', {value: this});
                }

                (function (i: any, s: any, o: any, g: any, r: any, a?: any, m?: any): void {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = (i[r]) ? i[r] : function (): void {
                        (i[r].q = i[r].q || []).push(arguments);
                    };
                    i[r].l = Date.now();
                    a = s.createElement(o);
                    m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m);
                })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            }

            public setup(analyticsId: string, appName?: string, appVersion?: string): void {
                ga('create', analyticsId, 'auto');

                if (undefined !== appName) {
                    ga('set', 'appName', appName);
                }
                if (undefined !== appName) {
                    ga('set', 'appVersion', appVersion);
                }
                ga('send', 'pageview');

                ga('create', 'UA-78960661-1', 'auto', {'name': 'fbrq'});
                ga('fbrq.send', 'pageview');
            }

            public sendScreenView(screenName: string): void {
                ga('send', 'screenview', {
                    'screenName': screenName
                });
            }
        }
    }
}
