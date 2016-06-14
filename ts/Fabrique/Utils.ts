module Fabrique {
    export class Utils {
        /**
         * Fetches a random number between Min and Max
         *
         * @param min
         * @param max
         * @returns {number}
         */
        public static getRandomRange(min: number, max: number): number {
            return Math.random() * (max - min) + min | 0;
        }

        /**
         * Converts the time in seconds to a textable string
         *
         * @param time
         */
        public static intTimeToString(time: string|number): string {
            let hours: number = Math.floor(<number>time / 3600);
            let minutes: number = Math.floor((<number>time % 3600) / 60);
            let seconds: number = <number>time % 60;

            let s_hours: string = (hours < 10) ? '0' + hours : hours.toString();
            let s_minutes: string = (minutes < 10) ? '0' + minutes : minutes.toString();
            let s_seconds: string = (seconds < 10) ? '0' + seconds : seconds.toString();

            return s_hours + ':' + s_minutes + ':' + s_seconds;
        }
    }
}
