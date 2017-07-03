module Fabrique {
    export class LoaderHelper {
        static show(): void {
            let loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'block';
            }
        }

        static hide(): void {
            let loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'none';
            }
        }
    }
}