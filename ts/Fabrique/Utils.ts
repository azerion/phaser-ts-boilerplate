module Fabrique {
    export enum UtmTargets {
        logo,
        moregames,
        splash
    }

    export class Utils {
        /**
         * Fetches an URL for upsell things
         *
         * @param type
         * @returns {string}
         */
        public static getUtmCampaignLink(type: UtmTargets) : string
        {
            return Constants.MORE_GAMES_URL +
                '/?utm_source='+
                window.location.hostname +
                '&utm_medium=html5&utm_term=' +
                Constants.GAME_TITLE +
                '&utm_content=' +
                UtmTargets[type] +
                '&utm_campaign=sponsored_games';
        }


        /**
         * Fetches a random number between Min and Max
         *
         * @param min
         * @param max
         * @returns {number}
         */
        public static getRandomRange(min:number, max:number){
            return Math.random() * (max - min) + min | 0;
        }


        /**
         * Converts the time in seconds to a textable string
         *
         * @param time
         */
        public static intTimeToString(time:string|number):string {
            var hours:number = Math.floor(<number>time / 3600);
            var minutes:number = Math.floor(<number>time / 60);
            var seconds:number = <number>time % 60;

            var s_hours:string = (hours < 10) ? '0' + hours : hours.toString();
            var s_minutes:string = (minutes < 10) ? '0' + minutes : minutes.toString();
            var s_seconds = (seconds < 10) ? '0' + seconds : seconds.toString();

            return s_hours + ':' + s_minutes + ':' + s_seconds;
        }
    }
}